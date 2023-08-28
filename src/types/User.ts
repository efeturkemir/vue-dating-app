export default interface User{
    id: string,
    username: string,
    age: number,
    bio?: string,
    userImage: string
    likes?: string[]
}