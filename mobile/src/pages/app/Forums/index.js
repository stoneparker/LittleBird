import React, { useState, useEffect } from 'react';
import { View, FlatList, Keyboard, LogBox } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

import HeaderBtnBack from '../../../components/HeaderBtnBack';
import ChatMessage from '../../../components/ChatMessage';
import ModalContainer from '../../../components/ModalContainer';
import TagsThemes from '../../../components/Tags';

import api from '../../../services/api';
import { useAuth } from '../../../contexts/auth';

import { 
   Container,
   Cover,
   Content,
   Title,
   Option,
   Options,
   Footer,
   InputBlock,
   Input,
   BtnInput,
   Header,
   HeaderBtnInfo,
   InfoIcon,
   ModalTitle,
   ModalDescription,
   ModalContent,
   ModalSubtitle,
   ModalSubtitleText,
   ModalRuleTitle,
   ModalRule,
   ModalRuleImg,
   ModalRuleDescription,
} from './styles';

const Forums = () => {
   const [liked, setLiked] = useState(false);   
   const [displayModal, setModalDisplay] = useState(true);
   const [forum, setForum] = useState({});
   const [comments, setComments] = useState([]);
   const [input, setInput] = useState('');
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(false);

   const route = useRoute();
   const { token } = useAuth();

   const { forum_id, forum_title } = route.params;

   const socket = io(`${api}/forum`)

   function openModal() {
      setModalDisplay(true);
   }

   async function handleSetLiked() {
      setLiked(liked ? false : true);

      if (!liked) {
         api.post(`forum/${forum_id}/like`, {}, {
            headers: {
               Authorization: token
            }
         })
         .then((response) => {
            if (response.status == 204) {
               setLiked(true);
            }
         })
         
      } else {
         api.delete(`forum/${forum_id}/like`, {
            headers: {
               Authorization: token
            }
         })
         .then((response) => {
            if (response.status == 204) {
               setLiked(false);
            }
         })
      }
   }

   async function sendComment() { 
      await api.post(
         `/forum/${forum_id}/comment`, 
         {comment_content: input}, 
         { 
            headers: {
               Authorization: token,
            },
         }
      )

      setInput('');
      Keyboard.dismiss();

      // loadComments();
   }

   async function loadComments() {
      if (loading) {
         return;
      }

      if (total > 0 && comments.length == total) {
         return;
      }

      setLoading(true);
      
      // const response = await api.get(`comment/forum/${forum_id}?page=${page}`);
      const responseForum = await api.get(`forum/${forum_id}/comment?page=${page}`);

      setComments([... comments, ... responseForum.data.comments]);
      setTotal(responseForum.headers['X-Total-Count']);
      setPage(page + 1);
      setLoading(false);
   }

   socket.emit('join forum', { nameRoom: forum_title });

   socket.on('new message', message => {
      console.log(message.comment_content)

      console.log('socket', socket.connected); 

      setComments([... message, ... comments]);
   });

   useEffect(() => {
      async function getContent() {
         const responseForum = await api.get(`forum/${forum_id}/comment?page=1`);
         setForum(responseForum.data);
         // setComments(responseForum.data.comments);
         loadComments();

         const responseForumLiked = await api.get(`/forum/user/like?page=1`, {
            headers: {
               Authorization: token
            }
         });

         responseForumLiked.data.map((item) => {
            item.forum_id === forum_id 
            ? setLiked(true)
            : ''
         });

         // socket.connect();
      }

      getContent();
   }, []);

   if (forum.forum_img_id === undefined) return false;

   return (
      <View style={{ flex: 1 }}>
         { displayModal &&
            <ModalContainer 
               onPress={() => setModalDisplay(false)}
               color_theme="#834397"
               font_color="#E9E9E9"
               btn_title="Entendi!"
            >
               <ModalTitle>Informações importantes</ModalTitle>
               <ModalDescription>
                  {forum.forum_description}
               </ModalDescription>
               
               <TagsThemes data={forum.themes} />

               <ModalContent>
                  <ModalSubtitle>
                     <ModalSubtitleText>Regras do chat</ModalSubtitleText>
                  </ModalSubtitle>

                  <ModalRuleTitle>1. Lorem Ipsum</ModalRuleTitle>
                  <ModalRule>
                     <ModalRuleImg />
                     <ModalRuleDescription>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. 
                     </ModalRuleDescription>
                  </ModalRule>

                  <ModalRuleTitle>2. Lorem Ipsum</ModalRuleTitle>
                  <ModalRule>
                     <ModalRuleImg />
                     <ModalRuleDescription>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. 
                     </ModalRuleDescription>
                  </ModalRule>

                  <ModalRuleTitle>3. Lorem Ipsum</ModalRuleTitle>
                  <ModalRule>
                     <ModalRuleImg />
                     <ModalRuleDescription>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. 
                     </ModalRuleDescription>
                  </ModalRule>
                  
               </ModalContent>
            </ModalContainer>
         }  

         <Container showsVerticalScrollIndicator={false}>
            <Header>
               <HeaderBtnBack />
               <HeaderBtnInfo onPress={openModal}>
                  <InfoIcon>i</InfoIcon>
               </HeaderBtnInfo>
            </Header>

            <Cover resizeMode="cover" source={{ uri: forum.forum_img_id.img_url }} />
            <Content>
               <Options>
                  <Option onPress={handleSetLiked}>
                     <MaterialIcons name={liked ? 'favorite' : 'favorite-border'} size={20} color={liked ? '#DA2243' : '#F6F6F6'} />
                  </Option>
               </Options>

               <Title>{forum.title}</Title>

               <FlatList
                  data={comments}
                  keyExtractor={comment => String(comment.comment_id)}
                  onEndReached={loadComments}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item }) => (
                     <ChatMessage key={item.comment_id} data={item} />   
                  )}
               />

            </Content>
         </Container>   
         
         <InputBlock>
            <Input 
               placeholder="Participe da conversa" 
               placeholderTextColor="#4B4B4B"
               value={input}
               onChangeText={text => setInput(text)}
            />
            <BtnInput onPress={sendComment}>  
               <MaterialIcons name="send" size={20} color="#E9E9E9" />
            </BtnInput>
         </InputBlock>
      </View>
   );
}

export default Forums;