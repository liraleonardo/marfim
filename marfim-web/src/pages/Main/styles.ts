import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #fff;
`;

export const AppMain = styled.div`
  width: 100%;
  height: 100vh;
  /* background-color: #ff00ff; */
`;

export const AppTopBar = styled.div``;

export const PageTitle = styled.h2`
  color: #2f2f2f;
  margin-left: 20px;
  font-size: 16px;
`;

export const AppSideBar = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff5ec;

  border-style: solid;
  border-width: 1px;
  border-top: 0;
  border-bottom: 0;
  border-left: 0;

  border-color: #efe5dc;

  img {
    width: 100px;
    margin: 30px 0;
  }

  .app-pages-menu {
    background-color: #fff5ec;
  }
`;
