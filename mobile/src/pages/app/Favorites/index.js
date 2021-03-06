import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import Header from '../../../components/Header';
import InterestCard from '../../../components/InterestCard';
import ShimmerInterestCard from '../../../components/Shimmer/ShimmerInterestCard';

import api from '../../../services/api';

import { useAuth } from '../../../contexts/auth';

import { 
   Menu,
   MenuBtn,
   MenuBtnText,
} from './styles';

const Favorites = () => {
   const [selectedCategory, setSelectedCategory] = useState(true);  // true = artigos, false = chats
   const [articles, setArticles] = useState([]);
   const [forums, setForums] = useState([]);
   const [pageArticles, setPageArticles] = useState(1);
   const [totalArticles, setTotalArticles] = useState(0);
   const [pageForums, setPageForums] = useState(1);
   const [totalForums, setTotalForums] = useState(0);
   const [loading, setLoading] = useState(false);
   
   const { token } = useAuth();

   function handleSetSelectedCategory() {
      setSelectedCategory(!selectedCategory);
   }

   async function getFavoriteArticles() {
      if (loading) {
         return;
      }

      if (totalArticles > 0 && articles.length == totalArticles) {
         return;
      }

      setLoading(true);

      const responseArticles = await api.get(`/article/user/like?page=${pageArticles}`, { headers: { Authorization: token } });
      
      setArticles([... articles, ... responseArticles.data]);
      setTotalArticles(responseArticles.headers['x-total-count']);
      setPageArticles(pageArticles + 1);
      setLoading(false);
   }

   async function getFavoriteForums() {
      if (loading) {
         return;
      }

      if (totalForums > 0 && forums.length == totalForums) {
         return;
      }

      setLoading(true);

      const responseForums = await api.get(`/forum/user/like?page=${pageForums}`, { headers: { Authorization: token } });

      setForums([... forums, ... responseForums.data]);
      setTotalForums(responseForums.headers['x-total-count']);
      setPageForums(pageForums + 1);
      setLoading(false);
   }

   useEffect(() => {
      getFavoriteArticles();
      getFavoriteForums();
   }, []);

   return (
      <View>
         <FlatList 
            data={loading ? [<ShimmerInterestCard />] : (selectedCategory ? articles : forums)}
            keyExtractor={favorite => selectedCategory ? String(favorite.article_id) : String(favorite.forum_id)}
            numColumns={2}
            onEndReached={selectedCategory ? getFavoriteArticles : getFavoriteForums}
            onEndReachedThreshold={0.8}
            columnWrapperStyle={{ marginHorizontal: 15 }}
            ListHeaderComponent={
               <>
                  <Header title="Favoritos" />
                  <Menu>
                     <MenuBtn 
                        selected={selectedCategory}
                        onPress={handleSetSelectedCategory}
                     >
                        <MenuBtnText selected={selectedCategory}>
                           Artigos
                        </MenuBtnText>
                     </MenuBtn>
                     <MenuBtn 
                        selected={!selectedCategory}
                        onPress={handleSetSelectedCategory}
                     >
                        <MenuBtnText selected={!selectedCategory}>
                           Chats
                        </MenuBtnText>
                     </MenuBtn>
                  </Menu>
               </>
            }
            renderItem={({ item }) => (
               loading ?
                  <ShimmerInterestCard />
               : (
                  selectedCategory ? 
                     <InterestCard 
                        img_url={item.article_id.article_img_id.img_url} 
                        name={item.article_id.title} 
                        type="article"
                        idContent={item.article_id.article_id}
                        isContent={true}
                     />
                  :
                     <InterestCard 
                        img_url={item.forum_img_id.img_url} 
                        type="forum"
                        idContent={item.forum_id}
                        name={item.title} 
                        isContent={true}
                     />
               )
            )}
         />
      </View>
   );
}

export default Favorites;