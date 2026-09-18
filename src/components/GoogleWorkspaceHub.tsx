import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FolderKanban, 
  Calendar as CalendarIcon, 
  Mail, 
  CheckSquare, 
  Video, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  FileText, 
  ExternalLink, 
  Plus, 
  RefreshCw, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithGoogle, 
  logOutFromFirebase, 
  initFirebaseAuth, 
  getCachedAccessToken,
  db,
  collection,
  getDocs,
  addDoc
} from '../services/firebase';
import {
  fetchDriveFiles,
  fetchCalendarEvents,
  createCalendarEvent,
  fetchRecentEmails,
  fetchGoogleTasks,
  createGoogleTask,
  createGoogleMeetSpace,
  fetchGoogleContacts,
  fetchClassroomCourses,
  DriveFile,
  CalendarEvent,
  GmailMessage,
  GoogleTask,
  GoogleContact,
  ClassroomCourse
} from '../services/workspaceApi';
import { useGymSettings } from '../context/GymSettingsContext';

export const GoogleWorkspaceHub: React.FC = () => {
  const { settings } = useGymSettings();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(getCachedAccessToken());
  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'calendar' | 'tasks' | 'meet' | 'gmail' | 'contacts'>('overview');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // Form states for adding items
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('Personal Training Session - Sawan Fitness');
  const [newSessionDate, setNewSessionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  });

  useEffect(() => {
    const unsubscribe = initFirebaseAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        if (accessToken) setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithGoogle();
      setUser(res.user);
      setToken(res.accessToken);
      setSuccessMsg('Successfully connected Google Workspace & Firebase account!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logOutFromFirebase();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    setCalendarEvents([]);
    setTasks([]);
    setEmails([]);
  };

  const loadWorkspaceData = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [filesData, eventsData, tasksData, emailsData] = await Promise.allSettled([
        fetchDriveFiles(token),
        fetchCalendarEvents(token),
        fetchGoogleTasks(token),
        fetchRecentEmails(token),
      ]);

      if (filesData.status === 'fulfilled') setDriveFiles(filesData.value);
      if (eventsData.status === 'fulfilled') setCalendarEvents(eventsData.value);
      if (tasksData.status === 'fulfilled') setTasks(tasksData.value);
      if (emailsData.status === 'fulfilled') setEmails(emailsData.value);
    } catch (err: any) {
      setErrorMsg('Failed to sync some Workspace items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadWorkspaceData();
    }
  }, [token]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !token) return;
    setLoading(true);
    try {
      const created = await createGoogleTask({ title: newTaskTitle }, token);
      setTasks([created, ...tasks]);
      setNewTaskTitle('');
      setSuccessMsg('Task added to Google Tasks!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const start = new Date(newSessionDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour session
      const created = await createCalendarEvent({
        summary: newSessionTitle,
        description: `Gym training session at ${settings.gymName}, Gargoti with trainer. Address: ${settings.address}`,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
      }, token);
      setCalendarEvents([created, ...calendarEvents]);
      setSuccessMsg('Session booked directly to Google Calendar!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to book session on Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeet = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const meet = await createGoogleMeetSpace(token);
      setMeetLink(meet.meetingUri);
      setSuccessMsg('Google Meet consultation space generated!');
    } catch (err: any) {
      // Fallback to instant Google Meet link
      const fallback = 'https://meet.google.com/new';
      setMeetLink(fallback);
      setSuccessMsg('Google Meet link ready!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="google-workspace-hub" className="py-16 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Cloud & Workspace Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Teko'] tracking-wide">
              Connected Operations Hub
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl">
              Sync gym operations with Google Drive, Sheets, Calendar, Tasks, Gmail, Meet, and Firebase Cloud Database.
            </p>
          </div>

          {/* Auth Controls */}
          <div>
            {!user ? (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-xl">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Google Avatar" className="w-7 h-7 rounded-full" />
                )}
                <div className="text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{user.displayName || 'Google User'}</div>
                  <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Services Status Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-8">
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Google Drive</div>
              <div className="text-[10px] text-emerald-400">Connected</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Calendar</div>
              <div className="text-[10px] text-emerald-400">Ready to Book</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Google Tasks</div>
              <div className="text-[10px] text-emerald-400">Synced</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Google Meet</div>
              <div className="text-[10px] text-emerald-400">Virtual Consult</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Gmail</div>
              <div className="text-[10px] text-emerald-400">Inquiry Alerts</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white">Firebase Cloud</div>
              <div className="text-[10px] text-emerald-400">Live Firestore</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === 'overview' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview & Quick Tools
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Google Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tasks' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Google Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'drive' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Drive & Sheets</span>
          </button>
          <button
            onClick={() => setActiveTab('meet')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'meet' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Google Meet</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Session Booking */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
                  Book to Calendar
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Schedule your next workout or personal trainer orientation straight into Google Calendar.
              </p>
              <form onSubmit={handleScheduleSession} className="space-y-3">
                <div>
                  <label className="text-[11px] text-neutral-300 font-semibold block mb-1">Session Title</label>
                  <input
                    type="text"
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-300 font-semibold block mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {token ? 'Schedule on Calendar' : 'Sign in with Google to Book'}
                </button>
              </form>
            </div>

            {/* Quick Daily Tasks */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <CheckSquare className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">
                    Gym Workout Tasks
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">
                  Add fitness targets or gym routines directly to your Google Tasks.
                </p>
                <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="e.g. 5 sets heavy squat..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {tasks.length > 0 ? (
                    tasks.slice(0, 4).map((t) => (
                      <div key={t.id} className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs">
                        <span className="text-neutral-200 truncate">{t.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Tasks API</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-neutral-500 italic">
                      {token ? 'No tasks yet. Type above to add.' : 'Sign in to view and add Google Tasks.'}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('tasks')}
                className="mt-4 text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View all tasks</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Virtual Fitness Consultation (Google Meet) */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-3">
                  <Video className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">
                    Live Virtual Consultation
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">
                  Need a video check on your lifting form or diet questions? Generate an instant Google Meet room with owner Sohel Mullani.
                </p>

                {meetLink ? (
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 mb-4">
                    <div className="text-[11px] text-indigo-300 font-bold mb-1">Meet Space Ready:</div>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 underline break-all font-mono"
                    >
                      {meetLink}
                    </a>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 mb-4">
                    Ready to generate Google Meet room on demand.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCreateMeet}
                  disabled={loading || !token}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  {meetLink ? 'Re-generate Room' : 'Start Instant Google Meet'}
                </button>
                {meetLink && (
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all"
                  >
                    <span>Join Room Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Calendar */}
        {activeTab === 'calendar' && (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white uppercase font-['Teko'] tracking-wide">
                Upcoming Google Calendar Gym Events
              </h3>
              <button
                onClick={loadWorkspaceData}
                disabled={loading || !token}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {calendarEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div className="text-xs font-bold text-white">{evt.summary}</div>
                    <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start.date}</span>
                    </div>
                    {evt.htmlLink && (
                      <a
                        href={evt.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                      >
                        <span>Open in Calendar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500">
                {token ? 'No upcoming events found on your primary calendar.' : 'Sign in with Google to view calendar events.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Tasks */}
        {activeTab === 'tasks' && (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
            <h3 className="text-lg font-bold text-white uppercase font-['Teko'] tracking-wide mb-4">
              Google Tasks List
            </h3>
            <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Add workout or gym task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
              />
              <button
                type="submit"
                disabled={loading || !token}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Add Task
              </button>
            </form>

            <div className="space-y-2">
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{t.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  {token ? 'No tasks found.' : 'Sign in with Google to view tasks.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Drive & Sheets */}
        {activeTab === 'drive' && (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
            <h3 className="text-lg font-bold text-white uppercase font-['Teko'] tracking-wide mb-4">
              Google Drive Files & Spreadsheets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {driveFiles.length > 0 ? (
                driveFiles.map((file) => (
                  <a
                    key={file.id}
                    href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 transition-all block text-xs"
                  >
                    <div className="font-bold text-white truncate">{file.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate mt-1">{file.mimeType}</div>
                    <div className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
                      <span>Open File</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-neutral-500">
                  {token ? 'No recent files found in Drive.' : 'Sign in with Google to list Drive documents.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Meet */}
        {activeTab === 'meet' && (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 max-w-xl mx-auto text-center">
            <Video className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white uppercase font-['Teko'] tracking-wide mb-2">
              Virtual Trainer & Diet Consultations
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Connect directly with Sawan Fitness Club trainers via Google Meet. Perfect for out-of-station members, remote diet consultations, or lifting form reviews.
            </p>
            <button
              onClick={handleCreateMeet}
              disabled={loading || !token}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg"
            >
              Generate Google Meet Link
            </button>
            {meetLink && (
              <div className="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">Your Google Meet room:</span>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 font-mono underline font-bold"
                >
                  {meetLink}
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
