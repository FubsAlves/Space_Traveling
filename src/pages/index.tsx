import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


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
        <div className={styles.loadPosts}>
          <a href='#'>Carregar mais posts</a>
        </div>
        
      </main>
    </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsFound = await prismic.getByType('posts', {pageSize: 5});
  const postsPaginationDateFormatted = postsFound.results.map((post) => {
      return {
        ...post,
        first_publication_date: format(
          new Date(),
           `dd MMM yyyy`,
          {
            locale: ptBR,
          }
        ) 
      }
  }) 

  return {
    props: {
      postsPagination: {
        results: [...postsPaginationDateFormatted],
        next_page: postsFound.next_page,
      }
    },
  }
};
