import { getCachedAccessToken } from './firebase';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface GmailMessage {
  id: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
}

export interface GoogleContact {
  resourceName: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  alternateLink?: string;
}

const getHeaders = (token?: string | null) => {
  const authToken = token || getCachedAccessToken();
  if (!authToken) {
    throw new Error('Google Workspace Access Token not available. Please sign in with Google first.');
  }
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};

// 1. Google Drive APIs
export const fetchDriveFiles = async (token?: string | null): Promise<DriveFile[]> => {
  const headers = getHeaders(token);
  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,modifiedTime,webViewLink,iconLink)',
    { headers }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch Drive files');
  }
  const data = await response.json();
  return data.files || [];
};

// 2. Google Calendar APIs
export const fetchCalendarEvents = async (token?: string | null): Promise<CalendarEvent[]> => {
  const headers = getHeaders(token);
  const now = new Date().toISOString();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime`,
    { headers }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch Calendar events');
  }
  const data = await response.json();
  return data.items || [];
};

export const createCalendarEvent = async (
  event: { summary: string; description: string; startDateTime: string; endDateTime: string },
  token?: string | null
): Promise<CalendarEvent> => {
  const headers = getHeaders(token);
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startDateTime },
        end: { dateTime: event.endDateTime },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create Calendar event');
  }
  return response.json();
};

// 3. Gmail APIs
export const fetchRecentEmails = async (token?: string | null): Promise<GmailMessage[]> => {
  const headers = getHeaders(token);
  const listResp = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
    { headers }
  );
  if (!listResp.ok) {
    const err = await listResp.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to list Gmail messages');
  }
  const listData = await listResp.json();
  if (!listData.messages || listData.messages.length === 0) return [];

  const messages: GmailMessage[] = [];
  for (const m of listData.messages.slice(0, 5)) {
    try {
      const msgResp = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        { headers }
      );
      if (msgResp.ok) {
        const msgData = await msgResp.json();
        const headersList = msgData.payload?.headers || [];
        const subject = headersList.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
        const from = headersList.find((h: any) => h.name === 'From')?.value || 'Unknown Sender';
        const date = headersList.find((h: any) => h.name === 'Date')?.value;
        messages.push({
          id: msgData.id,
          snippet: msgData.snippet,
          subject,
          from,
          date,
        });
      }
    } catch {
      // Continue to next message
    }
  }
  return messages;
};

// 4. Google Tasks APIs
export const fetchGoogleTasks = async (token?: string | null): Promise<GoogleTask[]> => {
  const headers = getHeaders(token);
  const listsResp = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', { headers });
  if (!listsResp.ok) {
    const err = await listsResp.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch Tasks list');
  }
  const listsData = await listsResp.json();
  const defaultList = listsData.items?.[0];
  if (!defaultList) return [];

  const tasksResp = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${defaultList.id}/tasks?showCompleted=true&maxResults=15`,
    { headers }
  );
  if (!tasksResp.ok) return [];
  const tasksData = await tasksResp.json();
  return (tasksData.items || []).map((t: any) => ({
    id: t.id,
    title: t.title || 'Untitled Task',
    notes: t.notes,
    status: t.status,
    due: t.due,
  }));
};

export const createGoogleTask = async (
  task: { title: string; notes?: string; due?: string },
  token?: string | null
): Promise<GoogleTask> => {
  const headers = getHeaders(token);
  const listsResp = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', { headers });
  const listsData = await listsResp.json();
  const listId = listsData.items?.[0]?.id || '@default';

  const resp = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: task.title,
      notes: task.notes,
      due: task.due,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create Task');
  }
  return resp.json();
};

// 5. Google Contacts (People API)
export const fetchGoogleContacts = async (token?: string | null): Promise<GoogleContact[]> => {
  const headers = getHeaders(token);
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=15',
    { headers }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch Contacts');
  }
  const data = await response.json();
  return (data.connections || []).map((c: any) => ({
    resourceName: c.resourceName,
    name: c.names?.[0]?.displayName || 'Unnamed Contact',
    email: c.emailAddresses?.[0]?.value,
    phone: c.phoneNumbers?.[0]?.value,
  }));
};

// 6. Google Meet Space Creation
export const createGoogleMeetSpace = async (token?: string | null): Promise<{ meetingUri: string; name: string }> => {
  const headers = getHeaders(token);
  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      config: {
        accessType: 'OPEN',
      },
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create Google Meet space');
  }
  const data = await response.json();
  return {
    meetingUri: data.meetingUri || `https://meet.google.com/${data.name?.split('/').pop() || 'new'}`,
    name: data.name,
  };
};

// 7. Google Classroom Courses
export const fetchClassroomCourses = async (token?: string | null): Promise<ClassroomCourse[]> => {
  const headers = getHeaders(token);
  const response = await fetch(
    'https://classroom.googleapis.com/v1/courses?pageSize=10',
    { headers }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch Classroom courses');
  }
  const data = await response.json();
  return (data.courses || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    section: c.section,
    alternateLink: c.alternateLink,
  }));
};
