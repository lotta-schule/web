import { State } from "./store/State";
import { ContentModuleType, UserModel, UserGroup } from "./model";

export const mockData: State = {
    user: {
        user: null,
        token: null
    },
    client: {
        client: {
            id: 'C001',
            slug: 'einsa',
            title: 'Medienportal'
        }
    },
    content: {
        categories: [
            {
                id: 'C0001',
                title: 'Profil'
            },
            {
                id: 'C0002',
                title: 'GTA'
            },
            {
                id: 'C0003',
                title: 'Projekte'
            },
            {
                id: 'C0004',
                title: 'Fächer'
            },
            {
                id: 'C0005',
                title: 'Material'
            },
            {
                id: 'C0006',
                title: 'Galerien'
            },
        ],
        articles: [
            {
                id: 'A01',
                createdAt: new Date(2019, 5, 18, 14, 12, 24),
                updatedAt: new Date(2019, 5, 18, 14, 12, 24),
                title: 'And the oskar goes to ...',
                preview: 'Hallo hallo hallo',
                previewImage: 'https://placeimg.com/640/480/animals',
                category: {
                    id: 'C0001',
                    title: 'Profil'
                },
                modules: [
                    {
                        id: 'M01',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    },
                    {
                        id: 'M02',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    }
                ]
            },
            {
                id: 'A02',
                createdAt: new Date(2018, 4, 7, 12, 15, 45),
                updatedAt: new Date(2018, 4, 7, 12, 15, 45),
                title: 'Landesfinale Volleyball WK IV',
                preview: 'Zweimal Silber für die Mannschaften des Christian-Gottfried-Ehrenberg-Gymnasium Delitzsch beim Landesfinale "Jugend trainiert für Europa" im Volleyball. Nach beherztem Kampf im Finale unterlegen ...',
                previewImage: 'https://placeimg.com/640/480/architecture',
                category: {
                    id: 'C0001',
                    title: 'Profil'
                },
                modules: [
                    {
                        id: 'M01',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    },
                    {
                        id: 'M02',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    }
                ]
            },
            {
                id: 'A03',
                createdAt: new Date(2019, 4, 3, 7, 56, 1),
                updatedAt: new Date(2019, 4, 3, 7, 56, 1),
                title: 'Der Podcast zum WB 2',
                preview: 'Das Podcastteam hat alle Hochlichter der Veranstaltung in einem originellen Film zusammengeschnitten. Wir beglückwünschen die Sieger und haben unseren Sieger gesondert gefeiert.',
                category: {
                    id: 'C0001',
                    title: 'Profil'
                },
                pageName: 'KleinKunst 2018',
                previewImage: 'https://placeimg.com/640/480/people',
                modules: [
                    {
                        id: 'M01',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    },
                    {
                        id: 'M02',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    }
                ]
            },
            {
                id: 'A04',
                createdAt: new Date(2019, 5, 8, 23, 18, 47),
                updatedAt: new Date(2019, 5, 8, 23, 18, 47),
                title: 'Der Vorausscheid',
                preview: 'Singen, Schauspielern, Instrumente Spielen - Die Kerndisziplinen von Klienkunst waren auch diese Jahr beim Vorausscheid am 14. Februar vertreten. Wir mischten uns unter die Kandidaten, Techniker und die Jury.',
                category: {
                    id: 'C0001',
                    title: 'Profil'
                },
                pageName: 'KleinKunst 2018',
                previewImage: 'https://placeimg.com/640/480/tech',
                modules: [
                    {
                        id: 'M01',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    },
                    {
                        id: 'M02',
                        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                        type: ContentModuleType.Text
                    }
                ]
            },
        ]
    },
    userFiles: {
        files: null,
        uploads: []
    }
};

type MockedUserModel = UserModel & { password: string };

export const mockUsers: MockedUserModel[] = [
    {
        id: 'U001',
        email: 'alexis@einsa.net',
        name: 'Alexis Rinaldoni',
        avatar: 'https://avatars.dicebear.com/v2/avataaars/alexisrinaldoni.svg',
        group: UserGroup.STUDENT,
        password: 'mp3'
    },
    {
        id: 'U002',
        email: 'billy@einsa.net',
        name: 'Christopher Bill',
        avatar: 'https://avatars.dicebear.com/v2/avataaars/billy.svg',
        group: UserGroup.STUDENT,
        password: 'test'
    },
    {
        id: 'U003',
        email: 'eike@einsa.net',
        name: 'Eike Wiewiorra',
        avatar: 'https://avatars.dicebear.com/v2/avataaars/eikewiewiorra.svg',
        group: UserGroup.TEACHER,
        password: 'vodkacola'
    },
];