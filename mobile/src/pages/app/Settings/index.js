import React, { useState, useEffect } from 'react';
import { Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as MailComposer from 'expo-mail-composer';

import HeaderBtnBack from '../../../components/HeaderBtnBack';
import { useAuth } from '../../../contexts/auth';

import { 
  Container,
  Content,
  Session,
  SessionHeader,
  SessionTitle,
  SessionOption,
  SessionOptionBtn,
  TitleOption,
  PanicBtn,
  PanicBtnTitle,
  BtnLogout,
  BtnLogoutText
} from './styles';
import Header from '../../../components/Header';

const Settings = () => {
  const navigation = useNavigation();
  const [darkTheme, setDarkTheme] = useState(true);
  const [keepLogin, setKeepLogin] = useState(true);
  const { signOut } = useAuth();
  
  useEffect(() => {

    async function getNotKeepLoading() {
      const notKeepLogin = await AsyncStorage.getItem('@LittleBird:notKeepLogin');

      if (notKeepLogin) {
        setKeepLogin(false);
      }
    }
    
    getNotKeepLoading();
  }, [])

  const toggleTheme = () => setDarkTheme(previousState => !previousState);
  
  function toggleKeepLogin() { 
    setKeepLogin(previousState => !previousState);
    
    // if (keepLogin) {
    //   Alert.alert(
    //     '', 
    //     'Para concluir esta ação, é preciso reiniciar o aplicativo. Deseja continuar?',
    //     [
    //       {
    //         text: 'Cancelar',
    //         onPress: () => {
    //           console.log('aaaaaaa'),
    //           setKeepLogin(true);
    //         }
    //       },
    //       {
    //         text: 'OK',
    //         onPress: async () => {
    //           await AsyncStorage.setItem('@LittleBird:notKeepLogin', 'true');
    //         }
    //       }
    //     ],
    //   )
    // }
  }

  function sendEmail() {
    MailComposer.composeAsync({
      subject: '',
      recipients: ['heyvitoria.lopes@gmail.com'],
      body: ''
    })
  }
  
  function handleSignOut() {
    signOut();
  }

  return (
    <Container>
      <Header title="Configurações" />

      <Content>
        <Session>
          <SessionHeader>
            <Feather name="smartphone" size={25} color="#01C24E" />
            <SessionTitle>Aplicativo</SessionTitle>
          </SessionHeader>
          <SessionOption>
            <TitleOption>Modo noturno</TitleOption>
            <Switch 
              value={darkTheme}
              onValueChange={toggleTheme}
              trackColor={{ false: "#323232", true: "#01C24E" }}
              thumbColor={darkTheme ? "#323232" : "#01C24E"}
            />
          </SessionOption>
          <SessionOption>
            <TitleOption>Manter-me logado</TitleOption>
            <Switch 
              value={keepLogin}
              onValueChange={toggleKeepLogin}
              trackColor={{ false: "#323232", true: "#01C24E" }}
              thumbColor={keepLogin ? "#323232" : "#01C24E"}
            />
          </SessionOption>
        </Session>

        <Session>
          <SessionHeader>
            <Feather name="users" size={25} color="#01C24E" />
            <SessionTitle>Contatos úteis</SessionTitle>
          </SessionHeader>
          <SessionOptionBtn onPress={sendEmail}>
            <TitleOption>Desenvolvedores (reportar erro)</TitleOption>
          </SessionOptionBtn>
          {/* <SessionOptionBtn>
            <TitleOption>Créditos de mídia</TitleOption>
          </SessionOptionBtn> */}
          <PanicBtn onPress={() => navigation.navigate('PanicBtn')}>
            <Feather name="alert-triangle" size={22} color="#E9E9E9" />
            <PanicBtnTitle>Ajuda ou emergência</PanicBtnTitle>
          </PanicBtn>
        </Session>

        <BtnLogout onPress={handleSignOut}>
          <BtnLogoutText>Sair</BtnLogoutText>
          <Feather name="log-out" size={20} color="#B8B8B8" />
        </BtnLogout>
      </Content>
    </Container>
  );
}

export default Settings;