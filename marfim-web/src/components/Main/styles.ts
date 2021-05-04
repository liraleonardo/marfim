import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const AppMain = styled.div`
  width: 100%;
  height: 100vh;
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
  background-color: #fff;

  border-style: solid;
  border-width: 1px;
  border-top: 0;
  border-bottom: 0;
  border-left: 0;

  border-color: #e7e7e7;

  > a {
    border: 0;
    border-style: solid;
    border-bottom: 1px;
    border-color: #1f1f1f;

    img {
      width: 100%;
      height: 50px;
      margin: 0 0;
      object-fit: cover;
    }
  }

  .app-pages-menu {
    background-color: inherit;
  }
`;

export const SidebarSeparator = styled.div`
  display: block;
  width: 90%;
  border-bottom: 1px solid #dee2e6;
`;