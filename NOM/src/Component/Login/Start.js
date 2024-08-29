import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react'

export default function Start({ navigation }) {
    return (
        <View>
            <View style={styles.centered}>
                <Image style={styles.fullScreenImage} source={require("../../img/Login.png")} />
            </View>

            <View style={[styles.centered, styles.offsetCenter]}>
                <View style={[styles.centered, styles.topOffset]}>
                    <Image style={styles.logo} source={require("../../img/Logo.png")} />
                    <Text style={styles.title}>Chào mừng đến với Aloper</Text>
                    <Text style={styles.subtitle}>Dễ dàng quản lý căn nhà của bạn với Aloper</Text>
                </View>

                <Pressable 
                    onPress={() => { navigation.navigate("Log") }} 
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </Pressable>

                <Pressable 
                    onPress={() => { navigation.navigate("REGISTER_SDT") }} 
                    style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                </Pressable>

                <View style={styles.textCenter}>
                    <Text style={styles.termsText}>
                        Bằng việc đăng nhập, tôi đồng ý với 
                        <Text style={styles.highlightedText}> điều khoản sử dụng </Text>
                        và
                        <Text style={styles.highlightedText}> chính sách riêng tư của Aloper.</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    offsetCenter: {
        marginTop: -224,
    },
    topOffset: {
        marginTop: -80,
    },
    logo: {
        marginTop: 35,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 12,
    },
    subtitle: {
        color: '#6B7280', // text-gray-600
        marginTop: 8,
    },
    loginButton: {
        backgroundColor: '#DC2626', // bg-rose-600
        borderRadius: 16,
        width: '83.33%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
    },
    registerButton: {
        backgroundColor: '#FECACA', // bg-red-200
        borderRadius: 16,
        width: '83.33%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    registerButtonText: {
        color: '#DC2626', // text-rose-600
        fontSize: 18,
    },
    textCenter: {
        textAlign: 'center',
    },
    termsText: {
        color: '#6B7280', // text-gray-600
        textAlign: 'center',
        marginTop: 12,
    },
    highlightedText: {
        color: '#DC2626', // text-rose-600
    }
});
