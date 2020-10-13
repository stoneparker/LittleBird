import React, { useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';

import { useAuth } from '../../../contexts/auth';
import Input from '../../../components/Input';

import { Container, Title, ActivityIndicatorContainer } from './styles';
import { BtnLogin, TextBtnLogin, BtnIcon } from '../../../components/BtnNext/styles';

const SignIn = () => {
  const route = useRoute();
  const email = route.params.data.email;
  const formRef = useRef(null);
  const { signIn, loadingAuth } = useAuth();

  async function handleSignIn(data, { reset }) {
    try {
      const schema = Yup.object().shape({
        password: Yup.string().required('A senha é obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      formRef.current.setErrors({});

      if (data.password === 'senha1234') {

        const user = {
          email,
          password: data.password,
        }

        await signIn(user, 'bolinhoroxo');
      } else {
        alert('Senha incorreta. Tente novamente.');
      }

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
      <StatusBar style="light" backgroundColor="#690589" />
      <Title>Bem-vinde de volta, bolinhorosa!</Title>
      <Form 
        style={{ width: '100%', alignItems: 'center' }} 
        ref={formRef} 
        onSubmit={handleSignIn}
      >
        <Input 
          name="password" 
          color="light"
          iconName="lock"
          placeholder="s3n#@000"
          legend="Sua senha"
        />
        <BtnLogin background="#F6F6F6" onPress={() => formRef.current.submitForm()}>
          <BtnIcon background="#E0E0E0">
            <Feather name="arrow-right" color="#690589" size={24} />
          </BtnIcon>
              { loadingAuth ?
                <ActivityIndicatorContainer background="#121212">
                  <ActivityIndicator size="small" color="#690589" />
                </ActivityIndicatorContainer>
                  : 
                <TextBtnLogin color="#690589">próximo</TextBtnLogin>
              }
        </BtnLogin>
      </Form>
    </Container>
  );
}

export default SignIn;