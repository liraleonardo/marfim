import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  toShow: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${(props) =>
    props.toShow === true
      ? css`
          display: block;
        `
      : css`
          display: none;
        `}
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.6);

  > div {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #7c804d;
    margin: 15% auto; /* 15% from the top and centered */

    border: 1px solid #5c602d;
    /* padding: 10px; */
    /* width: 30%; Could be more or less, depending on screen size */
    width: fit-content;
    max-width: 30%;
    min-width: 400px;

    > div {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      flex-direction: row;
      width: 100%;
      padding: 10px;

      h1 {
        color: #d2bc69;
        font-size: 20px;
        /* margin: 10px 20px; */
      }

      button {
        border: 0;
        /* margin-left: auto; */
        background: transparent;
        align-content: center;

        /* height: 100%;*/
        /* width: 24px; */
        /* height: 20px; */

        svg {
          color: #d2bc69;
          /* width: 24px;
          height: 24px; */
        }
      }
    }

    > button {
      background-color: #efefef;
      color: #5c602d;
      border: 0;
      width: 100%;
      padding: 5px;
      font-size: 20px;

      & + button {
        margin-top: 1px;
      }

      &:hover {
        color: ${shade(0.2, '#5c602d')};
        background-color: ${shade(0.2, '#efefef')};
      }
    }
  }
`;
