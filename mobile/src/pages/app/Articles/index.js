import React, { useState } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';

import { 
   Container,
   Content,
   Title,
   Cover,
   Author,
   AuthorName,
   Options,
   Option,
   Recommendations,
   TitleRecommendations,
   Item,
   TitleItem,
   LinkItem,
   LinkItemContainer,
   styles
} from './styles';

import HeaderBtnBack from '../../../components/HeaderBtnBack';
import TagsThemes from '../../../components/Tags';

const Articles = () => {
   const [liked, setLiked] = useState(false);
   const [saved, setSaved] = useState(false);
   const navigation = useNavigation();

   const article = '<t>Lorem ipsum dolor sit amet, <marker1>consectetur adipiscing elit</marker1>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \nUt enim ad minim veniam, quis nostrud <marker2>exercitation</marker2> ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in <marker3>reprehenderit in voluptate</marker3> velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</t>'

   function openWebView(url) {
      navigation.navigate('Webview', { link: url });
   }

   return (
      <Container>
         <HeaderBtnBack />
         <Cover resizeMode="cover" source={{ uri: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80' }} />
            <Content>
               <Options>
                  <Option onPress={() => setLiked(liked ? false : true)}>
                     <MaterialIcons name={liked ? 'favorite' : 'favorite-border'} size={20} color={liked ? '#DA2243' : '#F6F6F6'} />
                  </Option>
                  <Option onPress={() => setSaved(saved ? false : true)}>
                     <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={20} color="#F6F6F6" />
                  </Option>
               </Options>
               <Title>As mudanças durante a puberdade</Title>
               <Author>
                  <AuthorName>Dra. Cláudia Alcubierre</AuthorName>
                  <MaterialIcons name='verified-user' size={18} color="#3B9E8C" />
               </Author>

               <HTMLView 
                  value={article}
                  stylesheet={styles}
               />

               <TagsThemes />

               <Recommendations>
                  <TitleRecommendations>Saiba mais:</TitleRecommendations>
                  <View>
                     <Item>
                        <Feather name="check" color="#834397" size={25} />
                        <TitleItem>Vídeo:</TitleItem>
                     </Item>
                     <LinkItemContainer onPress={() => openWebView('https://www.youtube.com/watch?v=xw0MkTRmTu4')}>
                        <LinkItem numberOfLines={1}>O Que Realmente Acontece Quando Você Atinge a Puberdade?</LinkItem>
                     </LinkItemContainer>
                  </View>
                  <View>
                     <Item>
                        <Feather name="check" color="#834397" size={25} />
                        <TitleItem>Podcast:</TitleItem>
                     </Item>
                     <LinkItemContainer onPress={() => openWebView('https://open.spotify.com/track/4QVS8YCpK71R4FsxSMCjhP?si=QDb97iMUT_K-SH-emqqmDw')}>
                        <LinkItem>Puberdade: Meninos X Meninas</LinkItem>
                     </LinkItemContainer>
                  </View>
               </Recommendations>
            </Content>
      </Container>
   );
}

export default Articles;