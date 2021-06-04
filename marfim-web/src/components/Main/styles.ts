import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  .layout-topbar-menu {
    border-bottom: 1px solid #dee2e6;
    height: inherit;
    /* background: #ffaaaa; */
    padding: 0;
  }
`;

export const AppMain = styled.div`
  width: 100%;
  height: 100vh;
`;

export const AppTopBar = styled.div`
  .p-submenu-list {
    /* border: 2px #aaaaff solid; */
    width: auto;
    min-width: 200px;
    max-width: 300px;
    max-height: 70vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .layout-topbar-menu {
    border: 0;
    /* border-bottom: 1px solid #dee2e6; */
    height: inherit;
    padding: 0;
  }
`;

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

  .layout-menu-container {
    width: 100%;
  }

  .app-pages-menu {
    background-color: inherit;
  }

  .expandable-menu-item > .p-panelmenu-header {
    /* border-left: 3px #1faa1f solid; */
  }

  .expandable-menu-item > .p-menuitem-link {
    /* border: 1px #dee2e6 solid; */
    /* border-left: 3px #1faa1f solid; */
    background: #f8f9fa;
  }
`;

export const SidebarSeparator = styled.div`
  display: block;
  width: 90%;
  border-bottom: 1px solid #dee2e6;
`;
