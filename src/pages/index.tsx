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
import { useState } from 'react';


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

export default function Home({ postsPagination } : HomeProps) : JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleNextPage = async (): Promise<void> => { 
    if(nextPage) {
      const response = await fetch(nextPage).then(response => response.json());
      
      const { results, next_page: newNextPage} = response;

      const newPosts = results.map((post: Post) => {
        return {
          uid: post.uid,
          first_publication_date: post.first_publication_date,
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        };
      });

      const updatedPosts: Post[] = [...posts, ...newPosts];
      setPosts(updatedPosts);
      setNextPage(newNextPage);
    }
  }
  
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
          {posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
              <a href="#">
                <strong>{post.data.title}</strong>
                <span>{post.data.subtitle}</span>
                <time>
                  <FiCalendar />
                  {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                        locale: ptBR,
                      })}
                </time>
                <cite><FiUser /> {post.data.author}</cite>
              </a>
              </Link> 
          ))}
          
        </div>
        { nextPage && (
           <button className={styles.loadPosts} onClick={handleNextPage}>
            Carregar mais posts
          </button>
        )}
        
      </main>
    </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsFound = await prismic.getByType('posts', {pageSize: 1});

  const { next_page, results: posts } = postsFound;

  const results = posts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });


  return {
    props: {
      postsPagination: {
        results, next_page
      }
    },
  }
};
