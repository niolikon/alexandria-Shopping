export class Credentials {
    username: string;
    token: string;
    
    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;
    }

    static EMPTY:Credentials = {username: '', token: ''};
}