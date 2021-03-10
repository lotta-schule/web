import React, { memo } from 'react';
import { BaseLayoutMainContent } from './BaseLayoutMainContent';
import { BaseLayoutSidebar } from './BaseLayoutSidebar';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        lineHeight: '1.5em',
        '& h4, & h5, & h6': {
            padding: '.5em 0',
        },
        '& p': {
            margin: '5px 0',
        },
        '& ul': {
            paddingLeft: '2.5em',
            margin: '5px 0',
            '& li': {
                listStyle: 'disc',
                margin: '5px 0',
            },
        },
    },
}));

export const PrivacyLayout = memo(() => {
    const styles = useStyles();

    return (
        <>
            <BaseLayoutMainContent>
                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h3'}>
                            Datenschutzerklärung
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>Einleitung</Typography>
                        <Typography variant={'body1'}>
                            Mit der folgenden Datenschutzerklärung möchten wir
                            dich darüber aufklären, welche Arten deiner
                            personenbezogenen Daten (nachfolgend auch kurz als
                            "Daten“ bezeichnet) wir zu welchen Zwecken und in
                            welchem Umfang verarbeiten. Die Datenschutzerklärung
                            gilt für alle von uns durchgeführten Verarbeitungen
                            personenbezogener Daten, sowohl im Rahmen der
                            Erbringung unserer Leistungen als auch insbesondere
                            auf unseren Webseiten, in mobilen Applikationen
                            sowie innerhalb externer Onlinepräsenzen, wie z.B.
                            unserer Social-Media-Profile (nachfolgend
                            zusammenfassend bezeichnet als "Onlineangebot“).
                        </Typography>
                        <Typography variant={'subtitle1'}>
                            Stand: 28. August 2019
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>Verantwortlicher</Typography>
                        <Typography variant={'body1'}>
                            <strong>EinsA GbR</strong>
                            <br />
                            Wilhelminenstraße 10
                            <br />
                            04129 Leipzig
                            <br />
                            <br />
                            kontakt[at]einsa(punkt)net
                            <br />
                            <br />
                            vertretungsberechtigte Person:{' '}
                            <strong>Eike Wiewiorra</strong>
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Übersicht der Verarbeitungen
                        </Typography>
                        <Typography variant={'body1'}>
                            Die nachfolgende Übersicht fasst die Arten der
                            verarbeiteten Daten und die Zwecke ihrer
                            Verarbeitung zusammen und verweist auf die
                            betroffenen Personen.
                        </Typography>
                        <Typography variant={'h5'}>
                            Arten der verarbeiteten Daten
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>Bestandsdaten (z.B. Namen, Klasse).</li>
                                <li>
                                    Inhaltsdaten (z.B. Texteingaben,
                                    Fotografien, Videos).
                                </li>
                                <li>Kontaktdaten (z.B. E-Mail).</li>
                                <li>
                                    Meta-/Kommunikationsdaten (z.B.
                                    Geräte-Informationen, IP-Adressen).
                                </li>
                                <li>
                                    Nutzungsdaten (z.B. besuchte Webseiten,
                                    Interesse an Inhalten, Zugriffszeiten).
                                </li>
                            </ul>
                        </Typography>

                        <Typography variant={'h5'}>
                            Kategorien betroffener Personen
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    Nutzer (z.B. Webseitenbesucher, Nutzer von
                                    Onlinediensten).
                                </li>
                            </ul>
                        </Typography>

                        <Typography variant={'h5'}>
                            Zwecke der Verarbeitung
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>Content Delivery Network (CDN).</li>
                                <li>Sicherheitsmaßnahmen.</li>
                                <li>
                                    Vertragliche Leistungen und Service für die
                                    Administratoren.
                                </li>
                                <li>
                                    Verwaltung und Beantwortung von Anfragen.
                                </li>
                            </ul>
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Maßgebliche Rechtsgrundlagen
                        </Typography>
                        <Typography variant={'body1'}>
                            Im Folgenden teilen wir die Rechtsgrundlagen der
                            Datenschutzgrundverordnung (DSGVO), auf deren Basis
                            wir die personenbezogenen Daten verarbeiten, mit.
                            Bitte beachte, dass zusätzlich zu den Regelungen der
                            DSGVO die nationalen Datenschutzvorgaben in deinem
                            bzw. unserem Wohn- und Sitzland gelten können.
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>
                                        Einwilligung (Art. 6 Abs. 1 S. 1 lit. a
                                        DSGVO)
                                    </strong>{' '}
                                    - Die betroffene Person hat ihre
                                    Einwilligung in die Verarbeitung der sie
                                    betreffenden personenbezogenen Daten für
                                    einen spezifischen Zweck oder mehrere
                                    bestimmte Zwecke gegeben.
                                </li>
                                <li>
                                    <strong>
                                        Vertragserfüllung und vorvertragliche
                                        Anfragen (Art. 6 Abs. 1 S. 1 lit. b.
                                        DSGVO)
                                    </strong>{' '}
                                    - Die Verarbeitung ist für die Erfüllung
                                    eines Vertrags, dessen Vertragspartei die
                                    betroffene Person ist, oder zur Durchführung
                                    vorvertraglicher Maßnahmen erforderlich, die
                                    auf Anfrage der betroffenen Person erfolgen.
                                </li>
                                <li>
                                    <strong>
                                        Berechtigte Interessen (Art. 6 Abs. 1 S.
                                        1 lit. f. DSGVO)
                                    </strong>{' '}
                                    - Die Verarbeitung ist zur Wahrung der
                                    berechtigten Interessen des Verantwortlichen
                                    oder eines Dritten erforderlich, sofern
                                    nicht die Interessen oder Grundrechte und
                                    Grundfreiheiten der betroffenen Person, die
                                    den Schutz personenbezogener Daten
                                    erfordern, überwiegen.
                                </li>
                            </ul>
                        </Typography>
                        <Typography variant={'body1'}>
                            <strong>
                                Nationale Datenschutzregelungen in Deutschland:
                            </strong>
                            Zusätzlich zu den Datenschutzregelungen der
                            Datenschutz-Grundverordnung gelten nationale
                            Regelungen zum Datenschutz in Deutschland. Hierzu
                            gehört insbesondere das Gesetz zum Schutz vor
                            Missbrauch personenbezogener Daten bei der
                            Datenverarbeitung (Bundesdatenschutzgesetz – BDSG).
                            Das BDSG enthält insbesondere Spezialregelungen zum
                            Recht auf Auskunft, zum Recht auf Löschung, zum
                            Widerspruchsrecht, zur Verarbeitung besonderer
                            Kategorien personenbezogener Daten, zur Verarbeitung
                            für andere Zwecke und zur Übermittlung sowie
                            automatisierten Entscheidungsfindung im Einzelfall
                            einschließlich Profiling. Des Weiteren regelt es die
                            Datenverarbeitung für Zwecke des
                            Beschäftigungsverhältnisses (§ 26 BDSG),
                            insbesondere im Hinblick auf die Begründung,
                            Durchführung oder Beendigung von
                            Beschäftigungsverhältnissen sowie die Einwilligung
                            von Beschäftigten. Ferner können
                            Landesdatenschutzgesetze der einzelnen Bundesländer
                            zur Anwendung gelangen.
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Sicherheitsmaßnahmen
                        </Typography>
                        <Typography variant={'body1'}>
                            Wir treffen nach Maßgabe der gesetzlichen Vorgaben
                            unter Berücksichtigung des Stands der Technik, der
                            Implementierungskosten und der Art, des Umfangs, der
                            Umstände und der Zwecke der Verarbeitung sowie der
                            unterschiedlichen Eintrittswahrscheinlichkeiten und
                            des Ausmaßes der Bedrohung der Rechte und Freiheiten
                            natürlicher Personen geeignete technische und
                            organisatorische Maßnahmen, um ein dem Risiko
                            angemessenes Schutzniveau zu gewährleisten.
                        </Typography>
                        <Typography variant={'body1'}>
                            Zu den Maßnahmen gehören insbesondere die Sicherung
                            der Vertraulichkeit, Integrität und Verfügbarkeit
                            von Daten durch Kontrolle des physischen und
                            elektronischen Zugangs zu den Daten als auch des sie
                            betreffenden Zugriffs, der Eingabe, der Weitergabe,
                            der Sicherung der Verfügbarkeit und ihrer Trennung.
                            Des Weiteren haben wir Verfahren eingerichtet, die
                            eine Wahrnehmung von Betroffenenrechten, die
                            Löschung von Daten und Reaktionen auf die Gefährdung
                            der Daten gewährleisten. Ferner berücksichtigen wir
                            den Schutz personenbezogener Daten bereits bei der
                            Entwicklung bzw. Auswahl von Hardware, Software
                            sowie Verfahren entsprechend dem Prinzip des
                            Datenschutzes, durch Technikgestaltung und durch
                            datenschutzfreundliche Voreinstellungen.
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Datenverarbeitung in Drittländern
                        </Typography>
                        <Typography variant={'body1'}>
                            Sofern wir Daten in einem Drittland (d.h., außerhalb
                            der Europäischen Union (EU), des Europäischen
                            Wirtschaftsraums (EWR)) verarbeiten oder die
                            Verarbeitung im Rahmen der Inanspruchnahme von
                            Diensten Dritter oder der Offenlegung bzw.
                            Übermittlung von Daten an andere Personen, Stellen
                            oder Unternehmen stattfindet, erfolgt dies nur im
                            Einklang mit den gesetzlichen Vorgaben.
                        </Typography>
                        <Typography variant={'body1'}>
                            Vorbehaltlich ausdrücklicher Einwilligung oder
                            vertraglich oder gesetzlich erforderlicher
                            Übermittlung verarbeiten oder lassen wir die Daten
                            nur in Drittländern mit einem anerkannten
                            Datenschutzniveau, zu denen die unter dem
                            "Privacy-Shield" zertifizierten US-Verarbeiter
                            gehören, oder auf Grundlage besonderer Garantien,
                            wie z.B. vertraglicher Verpflichtung durch
                            sogenannte Standardschutzklauseln der EU-Kommission,
                            des Vorliegens von Zertifizierungen oder
                            verbindlicher interner Datenschutzvorschriften,
                            verarbeiten (Art. 44 bis 49 DSGVO, Informationsseite
                            der EU-Kommission:
                            <a
                                href="https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de
                            </a>
                            ).
                        </Typography>
                        <Typography variant={'body1'}>
                            Alle von Nutzern hochgeladenen Daten werden von uns
                            beim Unternehmen
                            <a
                                href="https://www.digitalocean.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                digitalocean
                            </a>
                            auf Servern mit Standorten innerhalb der EU
                            gespeichert.
                        </Typography>
                        <Typography variant={'body1'}>
                            Alle von Nutzern hochgeladenen Bilder werden zum
                            Schnelleren Abruf zum Unternehmen
                            <a
                                href="https://privacy.scaleflex.it/go/scaleflex-privacy-center/en/privacy-by-design"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Scaleflex
                            </a>
                            hochgeladen und von auch von dort wieder bezogen.
                        </Typography>
                        <Typography variant={'body1'}>
                            Alle von Nutzern hochgeladenen Video und
                            Audiodateien werden zum Unternehmen
                            <a
                                href="https://coconut.co/about"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Coconut
                            </a>
                            zur Umwandlung hochgeladen. Sie werden aber bei
                            Digitalocean auf Servern innerhalb der EU
                            gespeichert.
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Einsatz von Cookies
                        </Typography>
                        <Typography variant={'body1'}>
                            Als "Cookies“ werden kleine Dateien bezeichnet, die
                            auf Geräten der Nutzer gespeichert werden. Mittels
                            Cookies können unterschiedliche Angaben gespeichert
                            werden. Zu den Angaben können z.B. der Loginstatus,
                            oder die Stelle, an der ein Video geschaut wurde,
                            gehören.
                        </Typography>
                        <Typography variant={'body1'}>
                            Cookies werden im Regelfall auch dann eingesetzt,
                            wenn die Interessen eines Nutzers oder sein
                            Verhalten (z.B. Betrachten bestimmter Inhalte,
                            Nutzen von Funktionen etc.) auf einzelnen Webseiten
                            in einem Nutzerprofil gespeichert werden. Solche
                            Profile dienen dazu, den Nutzern z.B. Inhalte
                            anzuzeigen, die ihren potentiellen Interessen
                            entsprechen. Dieses Verfahren wird auch als
                            "Tracking", d.h., Nachverfolgung der potentiellen
                            Interessen der Nutzer bezeichnet. Zu dem Begriff der
                            Cookies zählen wir ferner andere Technologien, die
                            die gleichen Funktionen wie Cookies erfüllen (z.B.,
                            wenn Angaben der Nutzer anhand pseudonymer
                            Onlinekennzeichnungen gespeichert werden, auch als
                            "Nutzer-IDs" bezeichnet).
                        </Typography>
                        <Typography variant={'body1'}>
                            Soweit wir Cookies oder "Tracking"-Technologien
                            einsetzen, informieren wir Sie gesondert in unserer
                            Datenschutzerklärung.
                        </Typography>
                        <Typography variant={'body1'}>
                            <strong>Hinweise zu Rechtsgrundlagen:</strong> Die
                            Rechtsgrundlage der Verarbeitung Ihrer Daten ist
                            unserer berechtigten Interessen (z.B.
                            betriebswirtschaftlichen Betrieb unseres
                            Onlineangebotes und dessen Verbesserung) oder, wenn
                            der Einsatz von Cookies erforderlich ist, um unsere
                            vertraglichen Verpflichtungen zu erfüllen.
                        </Typography>
                        <Typography variant={'body1'}>
                            <strong>Widerruf und Widerspruch (Opt-Out):</strong>{' '}
                            Du hast jederzeit die Möglichkeit, eine erteilte
                            Einwilligung zu widerrufen oder der Verarbeitung
                            Deiner Daten durch Cookie-Technologien zu
                            widersprechen (zusammenfassend als "Opt-Out"
                            bezeichnet).
                            <br />
                            Du kannst deinen Widerspruch zunächst mittels der
                            Einstellungen deines Browsers erklären, z.B., indem
                            Sie die Nutzung von Cookies deaktivierst (wobei
                            hierdurch auch die Funktionsfähigkeit deines
                            Onlineangebotes eingeschränkt werden kann).
                            <br />
                            Für andere Möglichkeiten, schreib uns doch einfach
                            eine Email und wir können mit dir weitere Lösungen
                            besprechen.
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Registrierung und Anmeldung
                        </Typography>
                        <Typography variant={'body1'}>
                            Nutzer können ein Nutzerkonto anlegen. Im Rahmen der
                            Registrierung werden den Nutzern die erforderlichen
                            Pflichtangaben mitgeteilt und zu Zwecken der
                            Bereitstellung des Nutzerkontos auf Grundlage
                            vertraglicher Pflichterfüllung verarbeitet. Zu den
                            verarbeiteten Daten gehören insbesondere die
                            Login-Informationen (Name, Passwort sowie eine
                            E-Mail-Adresse). Die im Rahmen der Registrierung
                            eingegebenen Daten werden für die Zwecke der Nutzung
                            des Nutzerkontos und dessen Zwecks verwendet.
                        </Typography>
                        <Typography variant={'body1'}>
                            Die Nutzer können über Vorgänge, die für deren
                            Nutzerkonto relevant sind, wie z.B. technische
                            Änderungen, per E-Mail informiert werden. Wenn
                            Nutzer ihr Nutzerkonto gekündigt haben, werden deren
                            Daten im Hinblick auf das Nutzerkonto, vorbehaltlich
                            einer gesetzlichen Aufbewahrungspflicht, gelöscht.
                            Es obliegt den Nutzern, ihre Daten bei erfolgter
                            Kündigung vor dem Vertragsende zu sichern. Wir sind
                            berechtigt, sämtliche während der Vertragsdauer
                            gespeicherte Daten des Nutzers unwiederbringlich zu
                            löschen.
                        </Typography>
                        <Typography variant={'body1'}>
                            Im Rahmen der Inanspruchnahme unserer
                            Registrierungs- und Anmeldefunktionen sowie der
                            Nutzung des Nutzerkontos speichern wir die
                            IP-Adresse und den Zeitpunkt der jeweiligen
                            Nutzerhandlung. Die Speicherung erfolgt auf
                            Grundlage unserer berechtigten Interessen als auch
                            jener der Nutzer an einem Schutz vor Missbrauch und
                            sonstiger unbefugter Nutzung. Eine Weitergabe dieser
                            Daten an Dritte erfolgt grundsätzlich nicht, es sei
                            denn, sie ist zur Verfolgung unserer Ansprüche
                            erforderlich oder es besteht hierzu besteht eine
                            gesetzliche Verpflichtung.
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>Verarbeitete Datenarten:</strong>{' '}
                                    Bestandsdaten (z.B. Namen, Adressen),
                                    Kontaktdaten (z.B. E-Mail, Telefonnummern),
                                    Inhaltsdaten (z.B. Texteingaben,
                                    Fotografien, Videos),
                                    Meta-/Kommunikationsdaten (z.B.
                                    Geräte-Informationen, IP-Adressen).
                                </li>
                                <li>
                                    <strong>Betroffene Personen:</strong> Nutzer
                                    (z.B. Webseitenbesucher, Nutzer von
                                    Onlinediensten).
                                </li>
                                <li>
                                    <strong>Zwecke der Verarbeitung:</strong>{' '}
                                    Vertragliche Leistungen und Service,
                                    Sicherheitsmaßnahmen, Verwaltung und
                                    Beantwortung von Anfragen.
                                </li>
                                <li>
                                    <strong>Rechtsgrundlagen:</strong>{' '}
                                    Einwilligung (Art. 6 Abs. 1 S. 1 lit. a
                                    DSGVO), Vertragserfüllung und
                                    vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1
                                    lit. b. DSGVO), Berechtigte Interessen (Art.
                                    6 Abs. 1 S. 1 lit. f. DSGVO).
                                </li>
                            </ul>
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Bereitstellung des Onlineangebotes
                        </Typography>
                        <Typography variant={'body1'}>
                            Um unser Onlineangebot sicher und effizient
                            bereitstellen zu können, nehmen wir die Leistungen
                            von einem oder mehreren Webhosting-Anbietern in
                            Anspruch, von deren Servern (bzw. von ihnen
                            verwalteten Servern) das Onlineangebot abgerufen
                            werden kann. Zu diesen Zwecken können wir
                            Infrastruktur- und Plattformdienstleistungen,
                            Rechenkapazität, Speicherplatz und Datenbankdienste
                            sowie Sicherheitsleistungen und technische
                            Wartungsleistungen in Anspruch nehmen.
                        </Typography>
                        <Typography variant={'body1'}>
                            Zu den im Rahmen der Bereitstellung des
                            Hostingangebotes verarbeiteten Daten können alle die
                            Nutzer unseres Onlineangebotes betreffenden Angaben
                            gehören, die im Rahmen der Nutzung und der
                            Kommunikation anfallen. Hierzu gehören regelmäßig
                            die IP-Adresse, die notwendig ist, um die Inhalte
                            von Onlineangeboten an Browser ausliefern zu können,
                            und alle innerhalb unseres Onlineangebotes oder von
                            Webseiten getätigten Eingaben.
                        </Typography>
                        <Typography variant={'body1'}>
                            Content-Delivery-Network: Wir setzen ein
                            "Content-Delivery-Network" (CDN) ein. Ein CDN ist
                            ein Dienst, mit dessen Hilfe Inhalte eines
                            Onlineangebotes, insbesondere große Mediendateien,
                            wie Grafiken oder Programm-Skripte, mit Hilfe
                            regional verteilter und über das Internet
                            verbundener Server schneller und sicherer
                            ausgeliefert werden können.
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>Verarbeitete Datenarten:</strong>{' '}
                                    Inhaltsdaten (z.B. Texteingaben,
                                    Fotografien, Videos), Nutzungsdaten (z.B.
                                    besuchte Webseiten, Interesse an Inhalten,
                                    Zugriffszeiten), Meta-/Kommunikationsdaten
                                    (z.B. Geräte-Informationen, IP-Adressen).
                                </li>
                                <li>
                                    <strong>Betroffene Personen:</strong> Nutzer
                                    (z.B. Webseitenbesucher, Nutzer von
                                    Onlinediensten).
                                </li>
                                <li>
                                    <strong>Zwecke der Verarbeitung:</strong>{' '}
                                    Content Delivery Network (CDN).
                                </li>
                                <li>
                                    <strong>Rechtsgrundlagen:</strong>{' '}
                                    Berechtigte Interessen (Art. 6 Abs. 1 S. 1
                                    lit. f. DSGVO).
                                </li>
                            </ul>
                        </Typography>
                        <Typography variant={'h5'}>
                            Eingesetzte Dienste und Diensteanbieter:
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>DigitalOcean:</strong>{' '}
                                    Content-Delivery-Network (CDN);
                                    Dienstanbieter: DigitalOcean, LLC, 101
                                    Avenue of the Americas, New York, New York
                                    10013, USA; Website:
                                    https://www.digitalocean.com;
                                    Datenschutzerklärung:
                                    https://www.digitalocean.com/legal/privacy-policy;
                                    Privacy Shield (Gewährleistung
                                    Datenschutzniveau bei Verarbeitung von Daten
                                    in den USA):
                                    https://www.privacyshield.gov/participant?id=a2zt0000000TQNgAAO&status=Active.
                                </li>
                                <li>
                                    <strong>CloudImage:</strong>{' '}
                                    Content-Delivery-Network (CDN);
                                    Dienstanbieter Scaleflex,
                                    https://privacy.scaleflex.it/go/scaleflex-privacy-center/en/data-privacy-addendum
                                </li>
                            </ul>
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Änderung und Aktualisierung der Datenschutzerklärung
                        </Typography>
                        <Typography variant={'body1'}>
                            Wir bitten dich, dich regelmäßig über den Inhalt
                            unserer Datenschutzerklärung zu informieren. Wir
                            passen die Datenschutzerklärung an, sobald die
                            Änderungen der von uns durchgeführten
                            Datenverarbeitungen dies erforderlich machen. Wir
                            informieren dich, sobald durch die Änderungen eine
                            Mitwirkungshandlung deinerseits (z.B. Einwilligung)
                            oder eine sonstige individuelle Benachrichtigung
                            erforderlich wird.
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Rechte der betroffenen Personen
                        </Typography>
                        <Typography variant={'body1'}>
                            Wir bitten dich, dich regelmäßig über den Inhalt
                            unserer Datenschutzerklärung zu informieren. Wir
                            passen die Datenschutzerklärung an, sobald die
                            Änderungen der von uns durchgeführten
                            Datenverarbeitungen dies erforderlich machen. Wir
                            informieren dich, sobald durch die Änderungen eine
                            Mitwirkungshandlung deinerseits (z.B. Einwilligung)
                            oder eine sonstige individuelle Benachrichtigung
                            erforderlich wird.
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>Widerspruchsrecht:</strong> Sie
                                    haben das Recht, aus Gründen, die sich aus
                                    Ihrer besonderen Situation ergeben,
                                    jederzeit gegen die Verarbeitung der Sie
                                    betreffenden personenbezogenen Daten, die
                                    aufgrund von Art. 6 Abs. 1 lit. e oder f
                                    DSGVO erfolgt, Widerspruch einzulegen; dies
                                    gilt auch für ein auf diese Bestimmungen
                                    gestütztes Profiling. Werden die Sie
                                    betreffenden personenbezogenen Daten
                                    verarbeitet, um Direktwerbung zu betreiben,
                                    haben Sie das Recht, jederzeit Widerspruch
                                    gegen die Verarbeitung der Sie betreffenden
                                    personenbezogenen Daten zum Zwecke
                                    derartiger Werbung einzulegen; dies gilt
                                    auch für das Profiling, soweit es mit
                                    solcher Direktwerbung in Verbindung steht.
                                </li>
                                <li>
                                    <strong>
                                        Widerrufsrecht bei Einwilligungen:
                                    </strong>{' '}
                                    Sie haben das Recht, erteilte Einwilligungen
                                    jederzeit zu widerrufen.
                                </li>
                                <li>
                                    <strong>Auskunftsrecht:</strong> Sie haben
                                    das Recht, Sie haben das Recht, eine
                                    Bestätigung darüber zu verlangen, ob
                                    betreffende Daten verarbeitet werden und auf
                                    Auskunft über diese Daten sowie auf weitere
                                    Informationen und Kopie der Daten
                                    entsprechend den gesetzlichen Vorgaben.
                                </li>
                                <li>
                                    <strong>Recht auf Berichtigung:</strong> Sie
                                    haben entsprechend den gesetzlichen Vorgaben
                                    das Recht, die Vervollständigung der Sie
                                    betreffenden Daten oder die Berichtigung der
                                    Sie betreffenden unrichtigen Daten zu
                                    verlangen.
                                </li>
                                <li>
                                    <strong>
                                        Recht auf Löschung und Einschränkung der
                                        Verarbeitung:
                                    </strong>{' '}
                                    Sie haben nach Maßgabe der gesetzlichen
                                    Vorgaben das Recht, zu verlangen, dass Sie
                                    betreffende Daten unverzüglich gelöscht
                                    werden, bzw. alternativ nach Maßgabe der
                                    gesetzlichen Vorgaben eine Einschränkung der
                                    Verarbeitung der Daten zu verlangen.
                                </li>
                                <li>
                                    <strong>
                                        Recht auf Datenübertragbarkeit:
                                    </strong>{' '}
                                    Sie haben das Recht, Sie betreffende Daten,
                                    die Sie uns bereitgestellt haben, nach
                                    Maßgabe der gesetzlichen Vorgaben in einem
                                    strukturierten, gängigen und
                                    maschinenlesbaren Format zu erhalten oder
                                    deren Übermittlung an einen anderen
                                    Verantwortlichen zu fordern.
                                </li>
                                <li>
                                    <strong>
                                        Beschwerde bei Aufsichtsbehörde:
                                    </strong>{' '}
                                    Sie haben ferner nach Maßgabe der
                                    gesetzlichen Vorgaben das Recht, bei einer
                                    Aufsichtsbehörde, insbesondere in dem
                                    Mitgliedstaat Ihres gewöhnlichen
                                    Aufenthaltsorts, Ihres Arbeitsplatzes oder
                                    des Orts des mutmaßlichen Verstoßes, wenn
                                    Sie der Ansicht sind, dass die Verarbeitung
                                    der Sie betreffenden personenbezogenen Daten
                                    gegen die DSGVO verstößt.
                                </li>
                            </ul>
                        </Typography>
                        <Typography variant={'h5'}>
                            Für uns zuständige Aufsichtsbehörde:
                        </Typography>
                        <Typography variant={'body1'}>
                            <strong>Andreas Schurig</strong>
                            <br />
                            Devrientstraße 5<br />
                            01067 Dresden
                            <br />
                            <br />
                            Telefon: 03 51/85471-101
                            <br />
                            Telefax: 03 51/85471-109
                            <br />
                        </Typography>
                    </CardContent>
                </Card>

                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant={'h4'}>
                            Begriffsdefinitionen
                        </Typography>
                        <Typography variant={'body1'}>
                            In diesem Abschnitt erhalten Sie eine Übersicht über
                            die in dieser Datenschutzerklärung verwendeten
                            Begrifflichkeiten. Viele der Begriffe sind dem
                            Gesetz entnommen und vor allem im Art. 4 DSGVO
                            definiert. Die gesetzlichen Definitionen sind
                            verbindlich. Die nachfolgenden Erläuterungen sollen
                            dagegen vor allem dem Verständnis dienen. Die
                            Begriffe sind alphabetisch sortiert.
                        </Typography>
                        <Typography variant={'body1'}>
                            <ul>
                                <li>
                                    <strong>
                                        Content Delivery Network (CDN):
                                    </strong>{' '}
                                    Ein "Content Delivery Network" (CDN) ist ein
                                    Dienst, mit dessen Hilfe Inhalte eines
                                    Onlineangebotes, insbesondere große
                                    Mediendateien, wie Grafiken oder
                                    Programm-Skripte mit Hilfe regional
                                    verteilter und über das Internet verbundener
                                    Server, schneller und sicherer ausgeliefert
                                    werden können.
                                </li>
                                <li>
                                    <strong>Personenbezogene Daten:</strong>{' '}
                                    "Personenbezogene Daten“ sind alle
                                    Informationen, die sich auf eine
                                    identifizierte oder identifizierbare
                                    natürliche Person (im Folgenden "betroffene
                                    Person“) beziehen; als identifizierbar wird
                                    eine natürliche Person angesehen, die direkt
                                    oder indirekt, insbesondere mittels
                                    Zuordnung zu einer Kennung wie einem Namen,
                                    zu einer Kennnummer, zu Standortdaten, zu
                                    einer Online-Kennung (z.B. Cookie) oder zu
                                    einem oder mehreren besonderen Merkmalen
                                    identifiziert werden kann, die Ausdruck der
                                    physischen, physiologischen, genetischen,
                                    psychischen, wirtschaftlichen, kulturellen
                                    oder sozialen Identität dieser natürlichen
                                    Person sind.
                                </li>
                                <li>
                                    <strong>Verantwortlicher:</strong> Als
                                    "Verantwortlicher“ wird die natürliche oder
                                    juristische Person, Behörde, Einrichtung
                                    oder andere Stelle, die allein oder
                                    gemeinsam mit anderen über die Zwecke und
                                    Mittel der Verarbeitung von
                                    personenbezogenen Daten entscheidet,
                                    bezeichnet.
                                </li>
                                <li>
                                    <strong>Verarbeitung:</strong>{' '}
                                    "Verarbeitung" ist jeder mit oder ohne Hilfe
                                    automatisierter Verfahren ausgeführte
                                    Vorgang oder jede solche Vorgangsreihe im
                                    Zusammenhang mit personenbezogenen Daten.
                                    Der Begriff reicht weit und umfasst
                                    praktisch jeden Umgang mit Daten, sei es das
                                    Erheben, das Auswerten, das Speichern, das
                                    Übermitteln oder das Löschen.
                                </li>
                            </ul>
                        </Typography>
                    </CardContent>
                </Card>
            </BaseLayoutMainContent>
            <BaseLayoutSidebar isEmpty />
        </>
    );
});
export default PrivacyLayout;
