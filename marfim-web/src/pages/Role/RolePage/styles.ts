import styled from 'styled-components';

export const Container = styled.div`
  color: #0f0f0f;

  .permission-badge {
    border-radius: 2px;
    padding: 0.25em 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;
  }

  .permission-badge.level-read {
    background: #b5eacd;
    color: #256029;
  }
  .permission-badge.level-create {
    background: #e0cef7;
    color: #625078;
  }
  .permission-badge.level-update {
    background: #feedaf;
    color: #8a5340;
  }
  .permission-badge.level-delete {
    background: #fbdced;
    color: #c63737;
  }
  .permission-badge.level-5 {
    background: #ffcdd2;
    color: #c63737;
  }
  .permission-badge.level-all {
    background: #c1dcf1;
    color: #505478;
  }
`;
