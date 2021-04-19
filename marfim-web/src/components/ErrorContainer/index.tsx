import { Button } from 'primereact/button';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Messages } from 'primereact/messages';
import { getHttpError, unexpectedError } from '../../errors/httpErrors';
import { Container } from './styles';

interface ErrorContainerProps {
  status: string | number;
  title?: string;
  messages?: string[];
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({
  status,
  title = 'ERRO INESPERADO',
  messages = [],
  onButtonClick,
  buttonLabel: label,
}) => {
  const msgs = useRef<Messages>(null);

  useEffect(() => {
    // console.log(messages);
    msgs.current?.replace(
      messages.map((message) => {
        return {
          severity: 'error',
          detail: message,
          sticky: true,
          closable: false,
        };
      }),
    );
  }, [messages]);

  const buttonLabel = useMemo<string>(() => {
    if (label) {
      return label;
    }
    const httpError = getHttpError(status);
    let bLabel = unexpectedError.redirect.action as string;
    if (onButtonClick && httpError && httpError.redirect.action) {
      bLabel = httpError.redirect.action;
    }
    return bLabel;
  }, [label, status, onButtonClick]);

  const history = useHistory();

  const defaultButtonClick = useCallback(() => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      history.push('/');
    }
  }, [history, onButtonClick]);

  return (
    <Container>
      <div className="card ">
        <h1>{status}</h1>
        <h4>{title}</h4>

        <Messages ref={msgs} />

        <Button onClick={onButtonClick || defaultButtonClick}>
          <span>{buttonLabel}</span>
        </Button>
      </div>
    </Container>
  );
};

export default ErrorContainer;
