import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
} from "react-native";
import { useAuth } from "../context/AuthContext";

import { useFormik } from "formik";
import * as Yup from "yup";
import { registerAPI } from "../api/formAPI";
import { API_URL, IMG_FOOTER } from "../api/constants";

import { sendEmail } from "../api/emailAPI";

const SignIn = ({ navigation }) => {
  const { height } = Dimensions.get("window");

  const { signIn } = useAuth();

  const handleSignIn = (email) => {
    signIn('user', email);

    const data = {
      address: email,
      subject: "Bienvenido a Crypto Wallet",
      message: `¡Bienvenido a Crypto Wallet!<br><br>
      Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.<br><br>
      ¡Feliz trading!<br><br>
      Saludos,<br>
      El equipo de Crypto Wallet.<br>
      ${IMG_FOOTER}`
    }
    sendEmail(data);
  };

  async function createBalance (email) {
    console.log('\nbalance')
    const url = `${API_URL}/balances`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        cryptos: [
          { id: 1, name: "Bitcoin", balance: 7 },
          { id: 2, name: "Ethereum", balance: 7 },
          { id: 3, name: "Litecoin", balance: 7 },
          { id: 4, name: "Ripple", balance: 7 },
          { id: 5, name: "Cardano", balance: 7 },
        ]
      })
    }
    const response = await fetch(url, params);
    const result = await response.json();
  }

  // all about formik to check for data
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      try {
        const result = await registerAPI(formData);

        if (result.statusCode) throw "Error al crear usuario";

        console.log("Usuario creado");
        createBalance(formData.email);
        handleSignIn(formData.email);
      } catch (error) {
        console.log(error);
      }
    },
  });

  function initialValues() {
    return {
        email: '',
        username: '',
        password: '',
        repeatPassword: '',
        userType: 'user'
    }
  }

  function validationSchema() {
    return {
      email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
      repeatPassword: Yup.string()
        .required("Las contraseñas deben coincidir")
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir"),
    };
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Register</Text>
            {/* <Text style={styles.body}>Register</Text> */}

            <TextInput
              style={[styles.input, formik.errors.email && styles.errorInput]}
              placeholder="Enter email"
              autoCorrect={false}
              // formik
              onChangeText={(text) => {
                formik.setFieldValue("email", text);
                formik.setFieldValue("username", text);
              }}
              value={formik.values.email}
              error={formik.errors.email}
            />
            {formik.errors.email && formik.touched.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            <TextInput
              style={[
                styles.input,
                formik.errors.password && styles.errorInput,
              ]}
              placeholder="Password"
              autoCorrect={false}
              secureTextEntry={true}
              // formik
              onChangeText={(text) => formik.setFieldValue("password", text)}
              value={formik.values.password}
              error={formik.errors.password}
            />
            {formik.errors.password && formik.touched.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
            <TextInput
              style={[
                styles.input,
                formik.errors.repeatPassword && styles.errorInput,
              ]}
              placeholder="Repeat password"
              autoCorrect={false}
              secureTextEntry={true}
              // formik
              onChangeText={(text) =>
                formik.setFieldValue("repeatPassword", text)
              }
              value={formik.values.repeatPassword}
              error={formik.errors.repeatPassword}
            />
            {formik.errors.repeatPassword && formik.touched.repeatPassword && (
              <Text style={styles.errorText}>
                {formik.errors.repeatPassword}
              </Text>
            )}

            <TouchableOpacity
              style={styles.signInButton}
              /*onPress={handleSignIn}*/ onPress={formik.handleSubmit}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Register
              </Text>
            </TouchableOpacity>

            {/* <Text style={{ textAlign: "center" }}>Or register with</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button1}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png",
                  }}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Welcome")}
                style={styles.button1}
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
                  }}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  contentContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 35,
    textAlign: "center",
    color: "#353147",
    marginBottom: 30,
  },
  body: {
    padding: 20,
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 20,
    fontWeight: "400",
    textAlign: "center",
    color: "#353147",
  },
  buttonsText: {
    fontWeight: "500",
    color: "#353147",
  },
  button1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff70",
    padding: 16,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 16,
    marginHorizontal: 10,
  },
  button2: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",

    backgroundColor: "#DFE3E630",
    marginTop: 40,
  },
  input: {
    backgroundColor: "#F7F7F7",
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "#FD6D6A",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 30,
    shadowColor: "#FD6D6A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 3,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
