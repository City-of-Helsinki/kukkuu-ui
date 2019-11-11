import React from 'react';

import styles from './header.module.scss';
import Container from '../layout/Container';
import Navbar from './navbar/Navbar';

type Props = {};

function Header(props: Props) {
  return (
    <header className={styles.headerWrapper}>
      <Container>
        <Navbar />
      </Container>
    </header>
  );
}

export default Header;
