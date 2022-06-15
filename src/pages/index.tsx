import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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
    {console.log(homeProps.postsPagination.results)}
    <div className={commonStyles.container}>
      <main className={styles.content}>
        <div className={styles.logo}>
          <Image src='/logo.svg' width={225} layout='fixed' height={30} alt='logo'/>
        </div>
        <div className={styles.posts}>
          {homeProps.postsPagination.results.map(post => (
              <Link key={post.uid} href={`/posts/${post.uid}`}>
              <a href="#">
                <strong>{post.data.title}</strong>
                <span>{post.data.subtitle}</span>
                <time><FiCalendar /> {post.first_publication_date}</time>
                <cite><FiUser /> {post.data.author}</cite>
              </a>
              </Link> 
          ))}
            
        </div>
      </main>
    </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsPagination = await prismic.getByType('posts', {pageSize: 10});

  return {
    props: {
      postsPagination
    },
  }
};
