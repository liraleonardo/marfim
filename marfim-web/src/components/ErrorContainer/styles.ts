import styled from 'styled-components';

export const Container = styled.div`
  color: #0f0f0f;
  flex: 1;

  > div {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;

    > h1 {
      font-size: 10rem;
    }
    > h4 {
      font-size: 2rem;
    }
  }
`;
