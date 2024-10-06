import "../main.css";

export const metadata = {
  title: "コピっと！",
  description: "PC スマホ ログイン不要で自由にコピペができます",
  icons: {
    icon: "/assets/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#333] m-0 font-['Hiragino_Kaku_Gothic_ProN']">
        {children}
      </body>
    </html>
  );
}
