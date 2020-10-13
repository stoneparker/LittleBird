import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';

import Input from '../../../components/Input';

import { Container, Title } from './styles';
import { BtnLogin, TextBtnLogin, BtnIcon } from '../../../components/BtnNext/styles';

import api from '../../../services/api';

const HomeAuth = () => {
  const navigation = useNavigation();
  const formRef = useRef(null);

  async function handleSignIn(data, { reset }) {

    // const email = data.email;
    // console.log(email);

    // const response = await api.get('user/email', { body: email});
    
    // console.log(response.data);

    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('Digite seu e-mail.').min(7).email(),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      console.log(schema);

      formRef.current.setErrors({});

      if (data.email == "vitorinha@hotmail.com") {
        navigation.navigate('SignIn', { data });
        return;
      }
  
      navigation.navigate('SignUp1', { data });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  return (
    <Container>
      <StatusBar style="dark" backgroundColor="#D85517" />
      <Title>Digite seu e-mail</Title>
      <Form 
        style={{ width: '100%', alignItems: 'center' }} 
        ref={formRef} 
        onSubmit={handleSignIn}
      >
        <Input 
          name="email" 
          color="dark" 
          iconName="mail" 
          placeholder="exemplo@exemplo.com"
        />
        <BtnLogin background="#121212" onPress={() => formRef.current.submitForm()}>
          <BtnIcon background="#000">
            <Feather name="arrow-right" color="#D85517" size={24} />
          </BtnIcon>
          <TextBtnLogin color="#D85517">próximo</TextBtnLogin>
        </BtnLogin>
      </Form>
    </Container>
  );
}

export default HomeAuth;