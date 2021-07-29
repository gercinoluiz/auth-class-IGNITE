

interface SignInCredentials {

    email: string;
    password: string;

}

type User = {
    email?: string;
    permitions: string[];
    roles: string[]

}