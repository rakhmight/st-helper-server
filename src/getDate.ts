export default function getDate(date:String|undefined, time:String|undefined):number{
    return Date.parse(`${date} ${time}`)
}