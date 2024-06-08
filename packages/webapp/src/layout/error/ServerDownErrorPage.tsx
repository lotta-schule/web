import { memo } from 'react';

import { FullErrorPage } from './FullErrorPage';

export interface ServerDownErrorProps {
  error: Error;
}

export const ServerDownErrorPage = memo(({ error }: ServerDownErrorProps) => {
  return (
    <FullErrorPage
      title={'Server nicht erreichbar'}
      imageUrl={'/ServerDownImage.svg'}
    >
      <p>
        Der Server hat einen unbekannten Fehler geworfen. Das Team wurde
        informiert.
      </p>
      <p>
        Es tut uns leid für die Unannehmlichkeiten, hoffentlich funktioniert
        alles in ein paar Minuten wieder.
      </p>
      <p>{error.message}</p>
    </FullErrorPage>
  );
});
ServerDownErrorPage.displayName = 'ServerDownErrorPage';
