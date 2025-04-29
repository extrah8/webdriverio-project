export function randomString(length = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function randomPhoneNumber(): string {
    return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

export function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const genders = ['Male', 'Female', 'Other'];
export const subjects = ['Maths', 'Physics', 'Chemistry', 'Computer Science'];
export const hobbies = ['Sports', 'Reading', 'Music'];
export const states = ['NCR', 'Haryana', 'Rajasthan'];
export const cities = {
    NCR: ['Delhi', 'Gurgaon', 'Noida'],
    Haryana: ['Karnal', 'Panipat'],
    Rajasthan: ['Jaipur', 'Jaiselmer']
};