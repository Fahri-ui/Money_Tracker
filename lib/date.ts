// lib/date.ts
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { id as idLocale } from "date-fns/locale";

export const APP_TIMEZONE = "Asia/Jakarta";

/**
 * Format sebuah instant (Date, string ISO, atau timestamp dari database)
 * menjadi teks yang benar-benar mewakili waktu WIB — dipakai untuk SEMUA
 * tampilan jam/tanggal yang berasal dari kolom `timestamp` (createdAt, dll).
 */
export function formatWIB(date: Date | string, formatStr: string) {
  return formatInTimeZone(date, APP_TIMEZONE, formatStr, { locale: idLocale });
}

/**
 * Mengembalikan objek Date yang, jika dibaca lewat method getFullYear/getMonth/
 * getDate bawaan JS, akan menunjukkan tanggal & jam sesuai WIB — dipakai saat
 * kode SERVER perlu menghitung "hari ini" / "awal bulan" berdasarkan WIB,
 * bukan berdasarkan timezone server itu sendiri (yang biasanya UTC).
 */
export function nowInWIB(): Date {
  return toZonedTime(new Date(), APP_TIMEZONE);
}