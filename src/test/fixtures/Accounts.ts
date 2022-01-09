import { FileModelType, UserModel } from 'model';

/*
 *
 * UserGroups
 *
 */

export const adminGroup = {
    id: '1',
    insertedAt: '2015-01-01 00:00',
    updatedAt: '2015-01-01 00:00',
    name: 'Administrator',
    sortKey: 1000,
    isAdminGroup: true,
    enrollmentTokens: [],
};

export const lehrerGroup = {
    id: '4',
    insertedAt: '2015-01-01 00:00',
    updatedAt: '2015-01-01 00:00',
    name: 'Lehrer',
    sortKey: 2000,
    isAdminGroup: false,
    enrollmentTokens: [
        {
            id: '764',
            insertedAt: '2015-02-01 14:15',
            updatedAt: '2015-02-01 14:15',
            token: 'uhfhurehwuehf',
        },
    ],
};

export const elternGroup = {
    id: '10',
    insertedAt: '2015-01-10 11:00',
    updatedAt: '2015-01-12 14:00',
    name: 'Eltern',
    sortKey: 3000,
    isAdminGroup: false,
    enrollmentTokens: [],
};

export const schuelerGroup = {
    id: '5',
    insertedAt: '2015-01-01 07:45',
    updatedAt: '2015-01-01 07:45',
    name: 'Schüler',
    sortKey: 2000,
    isAdminGroup: false,
    enrollmentTokens: [
        {
            id: '884',
            insertedAt: '2015-0b-01 14:15',
            updatedAt: '2015-02-01 14:15',
            token: 'ajf82j84h2h',
        },
        {
            id: '892',
            insertedAt: '2015-02-01 14:15',
            updatedAt: '2015-02-01 14:15',
            token: 'uishfiji2j38f',
        },
    ],
};

export const userGroups = [adminGroup, lehrerGroup, schuelerGroup, elternGroup];

/*
 *
 * Directories
 *
 */

export const logosDirectory = {
    id: '8743',
    insertedAt: '2010-01-01 10:00',
    updatedAt: '2010-01-01 10:00',
    name: 'Logos',
    parentDirectory: null,
    usage: [],
};

export const profilDirectory = {
    id: '8744',
    insertedAt: '2010-01-01 10:00',
    updatedAt: '2010-01-01 10:00',
    name: 'Profil',
    parentDirectory: null,
    usage: [],
};

export const podcastsDirectory = {
    id: '8745',
    insertedAt: '2010-01-01 10:00',
    updatedAt: '2010-01-01 10:00',
    name: 'Profil',
    parentDirectory: null,
    usage: [],
};

export const schulweitDirectory = {
    id: '8746',
    insertedAt: '2010-01-01 10:00',
    updatedAt: '2010-01-01 10:00',
    name: 'Schulweit',
    parentDirectory: null,
    user: null,
    usage: [],
};

/*
 *
 * Files
 *
 */

export const imageFile = {
    id: '123',
    filename: 'Dateiname.jpg',
    filesize: 123123,
    fileType: FileModelType.Image,
    mimeType: 'image/jpg',
    insertedAt: '2001-01-01 14:15',
    updatedAt: '2001-01-01 14:15',
    fileConversions: [],
    usage: [],
};

export const otherImageFile = {
    id: '245',
    filename: 'Animiert.gif',
    filesize: 2123123,
    fileType: FileModelType.Image,
    mimeType: 'image/gif',
    insertedAt: '2001-01-01 14:15',
    updatedAt: '2001-01-01 14:15',
    fileConversions: [],
    usage: [],
};

export const documentFile = {
    id: '5445',
    filename: 'Manifest.pdf',
    filesize: 822123123,
    fileType: FileModelType.Pdf,
    mimeType: 'application/pdf',
    insertedAt: '1848-02-21 00:00',
    updatedAt: '1848-02-21 00:00',
    fileConversions: [],
    usage: [],
};

export const convertedDocumentFile = {
    id: '5545',
    filename: 'Bilderbuch.pdf',
    filesize: 2123123,
    fileType: FileModelType.Pdf,
    mimeType: 'application/pdf',
    insertedAt: '2001-01-21 00:00',
    updatedAt: '2001-01-21 00:00',
    usage: [],
    fileConversions: [
        {
            id: '55451',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
            fileType: FileModelType.Image,
            format: 'jpg:200',
            mimeType: 'image/jpg',
        },
        {
            id: '55452',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
            fileType: FileModelType.Audio,
            format: 'texttospeech:mp3',
            mimeType: 'audio/mp3',
        },
        {
            id: '55453',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
            fileType: FileModelType.Misc,
            format: 'ocr:txt',
            mimeType: 'plain/text',
        },
    ],
};

export const movieFile = {
    id: '75000',
    filename: 'Amelie.mp4',
    filesize: 2323232123123,
    fileType: FileModelType.Video,
    mimeType: 'video/mp4',
    insertedAt: '2001-01-21 00:00',
    updatedAt: '2001-01-21 00:00',
    usage: [],
    fileConversions: [
        {
            id: '75001',
            fileType: FileModelType.Image,
            format: 'gif:300',
            mimeType: 'image/gif',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75002',
            fileType: FileModelType.Image,
            format: 'storyboard:800',
            mimeType: 'image/jpg',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75003',
            fileType: FileModelType.Video,
            format: 'webm:1080',
            mimeType: 'video/webm',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75004',
            fileType: FileModelType.Video,
            format: 'webm:768',
            mimeType: 'video/webm',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75005',
            fileType: FileModelType.Video,
            format: 'mp4:1080',
            mimeType: 'video/mp4',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75006',
            fileType: FileModelType.Video,
            format: 'mp4:768',
            mimeType: 'video/mp4',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '75007',
            fileType: FileModelType.Audio,
            format: 'mp3:std',
            mimeType: 'audio/mp3',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
    ],
};

export const audioFile = {
    id: '99000',
    filename: 'Kaenguru.wav',
    filesize: 3232123123,
    fileType: FileModelType.Audio,
    mimeType: 'audio/wav',
    insertedAt: '2001-01-21 00:00',
    updatedAt: '2001-01-21 00:00',
    usage: [],
    fileConversions: [
        {
            id: '99001',
            fileType: FileModelType.Audio,
            format: 'hifi:flac',
            mimeType: 'audio/flac',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
        {
            id: '99002',
            fileType: FileModelType.Audio,
            format: 'lofi:mp3',
            mimeType: 'audio/mp3',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
    ],
};

export const powerpointFile = {
    id: '20',
    filename: 'praesi.ppt',
    filesize: 23123,
    fileType: FileModelType.Misc,
    mimeType: 'application/mspowerpoint',
    insertedAt: '2001-01-21 00:00',
    updatedAt: '2001-01-21 00:00',
    usage: [],
    fileConversions: [
        {
            id: '21',
            fileType: FileModelType.Misc,
            format: 'thumbnail:jpg',
            mimeType: 'image/jpg',
            insertedAt: '2001-01-21 00:00',
            updatedAt: '2001-01-21 00:00',
        },
    ],
};

/*
 *
 *
 * Users
 *
 *
 *
 *
 */

export const SomeUser = {
    id: '1',
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    email: 'userAvatar@lotta.schule',
    name: 'Ernesto Guevara',
    class: '5/1',
    unreadMessages: 0,
    groups: [],
    enrollmentTokens: [],
    hideFullName: false,
    nickname: 'Che',
    avatarImageFile: null,
    hasChangedDefaultPassword: true,
};

export const SomeUserin = {
    id: '2',
    insertedAt: '2019-05-18 10:00',
    updatedAt: '2019-05-18 10:00',
    lastSeen: '2019-05-18 10:00',
    email: 'userin@andereandresse.com',
    name: 'Luisa Drinalda',
    class: '',
    unreadMessages: 0,
    groups: [],
    enrollmentTokens: [],
    hideFullName: true,
    nickname: 'Lui',
    avatarImageFile: null,
    hasChangedDefaultPassword: true,
};

export const KeinErSieEsUser = {
    id: '3',
    insertedAt: '2019-05-18 10:00',
    updatedAt: '2019-05-18 10:00',
    lastSeen: '2019-05-18 10:00',
    email: 'userin@andereandresse.com',
    name: 'Michel Dupond (das frz. Michel)',
    class: '',
    unreadMessages: 0,
    groups: [],
    enrollmentTokens: [],
    hideFullName: false,
    nickname: 'Mich',
    avatarImageFile: null,
    hasChangedDefaultPassword: true,
};

export const getPrivateAndPublicFiles = (user: UserModel) => {
    const directories = [
        logosDirectory,
        profilDirectory,
        podcastsDirectory,
    ].map((directory) => ({ ...directory, user }));

    return [
        schulweitDirectory,
        ...directories,
        ...[
            { ...imageFile, parentDirectory: directories[0] },
            { ...otherImageFile, parentDirectory: directories[0] },
            { ...documentFile, parentDirectory: directories[1] },
            { ...convertedDocumentFile, parentDirectory: directories[1] },
            { ...movieFile, parentDirectory: directories[2] },
            { ...audioFile, parentDirectory: directories[2] },
            { ...powerpointFile, parentDirectory: directories[1] },
        ].map((fileOrDirectory) => ({ ...fileOrDirectory, userId: user.id })),
    ];
};
