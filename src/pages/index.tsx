import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";


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
    </Head>
    <div className={commonStyles.container}>
      <main className={styles.content}>
        <div className={styles.logo}>
          <Image src='/logo.svg' width={225} layout='fixed' height={30} alt='logo'/>
        </div>
        <div className={styles.posts}>
            <article>
                <strong>Nam fringilla orci in finibus vestibulum</strong>
                <span>Nunc nec orci in ex gravida rutrum. Duis eu dui accumsan sem cursus hendrerit vitae in augue.</span>
                <time><FiCalendar /> 15/06/2022</time>
                <cite><FiUser /> Maecenas</cite>
            </article>
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
