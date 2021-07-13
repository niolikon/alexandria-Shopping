export class User {
    username: string;
    firstname: string;
    lastname: string;
    facebookId: string;
    roles: string[];
    
    constructor(username: string, firstname: string,
        lastname: string, facebookId: string, roles: string[]) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.facebookId = facebookId;
        this.roles = roles;
    }

    static EMPTY: User = {
        username: '',
        firstname: '',
        lastname: '',
        facebookId: '',
        roles:[]
    }
}