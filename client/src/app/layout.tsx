export const metadata = {
  title: "コピっと！", // タブネームをここで設定
  description: "PC スマホ ログイン不要で自由にコピペができます",
  icons: {
    icon: "/assets/icon.ico", // ファビコンを指定
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: "0" }}>{children}</body>
    </html>
  );
}
