export default function transformToCssKey(key: string): string {
    return key.replace(/[A-Z]/g, (a: string, b: number) => {
        console.log(a, b);
        return `-${a.toLowerCase()}`;
    });
}