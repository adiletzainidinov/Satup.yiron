import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"KORAN Academy — обучение продажам",description:"Практика продаж Корана: 100 уровней и ежедневные тренировки"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}