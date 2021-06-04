import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 12px 0;
  background: #7c804d;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 60px;
  }
  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #d2bc69;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #d2bc69;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.div`
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background: #ff00ff; */
  margin: auto;

  p {
    color: #28262e;
  }
`;

export const UserCard = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  height: 70px;
  width: 450px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  div {
    display: flex;
    align-items: center;
    /* background: #00ff00; */
    margin: 10px;
    height: 50px;

    img {
      width: 50px;

      border-radius: 50%;
      align-self: center;
      margin-left: 10px;
    }

    div {
      /* background: #ff0000; */
      color: #7c804e;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      strong {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
`;
