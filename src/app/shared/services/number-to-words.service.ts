import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NumberToWordsService {

    convertNumberToWords(num: number): string {

        if (num == null || isNaN(num)) return "";

        // مرحله 1: تبدیل ریال به تومان
        const toman = Math.floor(num / 10);

        if (toman === 0) return "صفر تومان";

        const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
        const tens = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
        const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
        const hundreds = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
        const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

        const convertThreeDigits = (n: number): string => {
            let str = "";

            if (n >= 100) {
                str += hundreds[Math.floor(n / 100)];
                n %= 100;
                if (n > 0) str += " و ";
            }

            if (n >= 20) {
                str += tens[Math.floor(n / 10)];
                n %= 10;
                if (n > 0) str += " و ";
            } else if (n >= 10) {
                str += teens[n - 10];
                n = 0;
            }

            if (n > 0) str += ones[n];

            return str;
        };

        let number = toman;
        let parts: string[] = [];
        let scaleIndex = 0;

        while (number > 0) {
            const chunk = number % 1000;

            if (chunk !== 0) {
                let chunkWords = convertThreeDigits(chunk);
                if (scales[scaleIndex]) chunkWords += " " + scales[scaleIndex];
                parts.unshift(chunkWords);
            }

            number = Math.floor(number / 1000);
            scaleIndex++;
        }

        return parts.join(" و ") + " تومان";
    }

}
