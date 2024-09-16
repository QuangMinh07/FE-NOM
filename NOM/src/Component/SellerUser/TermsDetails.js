import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

// Sử dụng Dimensions để lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

export default function TermsDetails() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', height: height * 0.1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: width * 0.05, fontWeight: 'bold', marginLeft: 10 }}>
          Thông tin chi tiết
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
        <View style={{
          borderWidth: 1,
          borderColor: '#E53935',
          padding: width * 0.05,
          borderRadius: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5 // for Android shadow
        }}>
          <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', color: '#E53935', marginBottom: 10, textAlign: 'center' }}>
            Điều khoản và Điều kiện Sử dụng
          </Text>

          <Text style={{ fontSize: width * 0.04, color: '#333', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>1. Chấp nhận Điều khoản{"\n"}</Text>
            Bằng việc đăng ký và sử dụng Nom, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với tất cả các Điều khoản và Điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không nên tiếp tục sử dụng ứng dụng.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>2. Điều kiện Sử dụng{"\n"}</Text>
            Tuổi tối thiểu: Bạn phải từ 18 tuổi trở lên để đăng ký và sử dụng Nom.{"\n"}
            Khả năng pháp lý: Bạn phải có khả năng pháp lý để ký kết hợp đồng theo luật pháp hiện hành.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>3. Quyền và Trách nhiệm của Người dùng{"\n"}</Text>
            Quyền của bạn: Bạn có quyền truy cập và sử dụng các dịch vụ mà Nom cung cấp, tuân theo các điều khoản này.{"\n"}
            Trách nhiệm của bạn: Bạn có trách nhiệm cung cấp thông tin chính xác, bảo mật tài khoản của mình, và tuân thủ mọi quy định pháp luật liên quan khi sử dụng Nom.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>4. Bảo mật Thông tin{"\n"}</Text>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách Bảo mật. Bằng cách sử dụng Nom, bạn đồng ý rằng chúng tôi có thể thu thập, sử dụng và chia sẻ thông tin của bạn theo các điều khoản trong Chính sách Bảo mật.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>5. Sử dụng Dịch vụ{"\n"}</Text>
            Bạn không được sử dụng Nom cho các hoạt động vi phạm pháp luật, lừa đảo, hoặc bất kỳ hành vi nào gây hại cho Nom hoặc người dùng khác. Nom có quyền chấm dứt tài khoản của bạn nếu phát hiện vi phạm.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>6. Thanh toán và Phí Dịch vụ{"\n"}</Text>
            Bạn có trách nhiệm thanh toán tất cả các khoản phí liên quan đến dịch vụ mà bạn sử dụng thông qua Nom. Mọi khoản phí và phương thức thanh toán sẽ được hiển thị rõ ràng trước khi bạn thực hiện giao dịch.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>7. Chính sách Hoàn tiền{"\n"}</Text>
            Chúng tôi chỉ chấp nhận hoàn tiền trong các trường hợp sau:{"\n"}
            Dịch vụ không được cung cấp đúng như cam kết ban đầu.{"\n"}
            Lỗi hệ thống từ phía Nom dẫn đến việc bạn không thể sử dụng dịch vụ.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>8. Giới hạn Trách nhiệm{"\n"}</Text>
            Nom không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn các thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, hoặc hệ quả.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>9. Quy tắc về Ngôn từ và Hình ảnh{"\n"}</Text>
            Cấm, ngôn từ, hình ảnh khiêu dâm, bạo lực, phân biệt chủng tộc, hoặc vi phạm bản quyền.
            {"\n\n"}

            <Text style={{ fontWeight: 'bold', color: '#E53935' }}>10. Liên hệ{"\n"}</Text>
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản và Điều kiện này, vui lòng liên hệ với chúng tôi qua email: support@nom.com hoặc qua hotline: 1900-1234.
            {"\n\n"}

            <Text style={[{ fontWeight: 'bold', color: '#E53935' }]}>11. Đồng ý và Tiếp tục{"\n"}</Text>
            Bằng cách nhấn nút "Tôi đồng ý", bạn xác nhận rằng bạn đã đọc và hiểu các Điều khoản và Điều kiện trên, và đồng ý tuân theo tất cả các điều khoản này khi sử dụng Nom.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
