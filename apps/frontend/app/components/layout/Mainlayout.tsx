export default function Mainlayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#0B0B0B] text-white flex flex-col"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
    </div>
  );
}