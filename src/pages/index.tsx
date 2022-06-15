import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(homeProps : HomeProps) {
  return(
    <>
    <Head>
      <title>SpaceTraveling | Home</title>
      {console.log(homeProps)}
    </Head>
    <div className={commonStyles.container}>
      <main className={styles.content}>
        <div className={styles.logo}>
          <Image src='/logo.svg' width={225} layout='fixed' height={30} alt='logo'/>
        </div>
        <div>
            <strong>title</strong>
            <p>description</p>
            <time>data</time>
            <p>Autor</p>

        </div>
      </main>
    </div>
    </>
    
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {pageSize: 10});

  return {
    props: {
      postsResponse
    },
  }
};
