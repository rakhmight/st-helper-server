export default function genSecretKey(length:number): string {
    const chrs:string = 'abcdefghklmnopqrstvwxyzABCDEFGHKLMONPQRSTVWXYZ0123456789'
    let str: string = ''
    for (let i = 0; i < length; i++) {
        let pos = Math.floor(Math.random() * chrs.length)
        str += chrs.substring(pos,pos+1)
    }
    
    return str
}