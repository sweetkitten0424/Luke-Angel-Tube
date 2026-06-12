import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { connectDB } from '@/src/lib/db';
import User from '@/src/models/User';
import Video from '@/src/models/Video';

export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session?.user) redirect('/api/auth/login');

  await connectDB();
  const dbUser = await User.findOne({ auth0Id: session.user.sub });
  
  // Simple role check access logic protection
  if (!dbUser || dbUser.role !== 'admin') {
    return <div className="text-center text-red-500 font-bold p-10">Access Denied: Admin Rights Required.</div>;
  }

  const totalUsers = await User.countDocuments();
  const totalVideos = await Video.countDocuments();
  const allUsers = await User.find().sort({ createdAt: -1 });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><p className="text-xs text-zinc-400">Total System Users</p><p className="text-2xl font-black">{totalUsers}</p></div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"><p className="text-xs text-zinc-400">Total Uploaded Videos</p><p className="text-2xl font-black">{totalVideos}</p></div>
      </div>
      
      <h2 className="text-lg font-bold mt-4">User Management Ledger</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Account System Role</th></tr>
          </thead>
          <tbody>
            {allUsers.map((user: any) => (
              <tr key={user._id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50">
                <td className="p-4 flex items-center gap-2"><img src={user.picture} className="w-6 h-6 rounded-full" /> {user.name}</td>
                <td className="p-4 text-zinc-300">{user.email}</td>
                <td className="p-4 font-mono text-xs">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
