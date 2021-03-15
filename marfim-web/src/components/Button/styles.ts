import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #d2bc69;
  height: 56px;
  border-radius: 30px 0;
  border: 0;
  padding: 0 16px;
  color: #5b602e;
  width: 60%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#d2bc69')};
  }
`;
