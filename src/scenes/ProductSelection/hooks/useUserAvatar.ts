import { useAtomValue } from 'jotai';
import { userNameAtom } from '../../../store/authStore';

export function useCurrentUserAvatar() {
    const userName = useAtomValue(userNameAtom)
    return stringAvatar(userName)
}

export function useUserAvatar(name: string) {
    return stringAvatar(name)
}


function stringAvatar(name: string) {
    const letters = name.split(' ')
    let initials = letters[0][0].toUpperCase()
    if (letters.length > 1) {
        initials += letters[1][0].toUpperCase()
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginLeft: 'auto',
        },
        children: initials,
    };
}


function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color
}