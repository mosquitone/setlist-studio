'use client';

import { Typography, List, ListItem, ListItemText } from '@mui/material';
import Script from 'next/script';
import React from 'react';

import LegalPageTemplate from '@/components/common/templates/LegalPageTemplate';
import { useI18n } from '@/hooks/useI18n';
import { getLegalPageSchema } from '@/lib/metadata/pageSchemas';

const PrivacyClient: React.FC = () => {
  const { messages } = useI18n();
  const privacySchema = getLegalPageSchema('privacy');

  return (
    <>
      <Script
        id="privacy-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <LegalPageTemplate title={messages.pages.privacy.title}>
        <Typography variant="body2" color="text.secondary" paragraph>
          mosquitone（以下「当方」といいます。）は、本ウェブサイト上で提供するサービス「Setlist
          Studio」（以下「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第1条（個人情報）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第2条（個人情報の収集方法）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、ユーザーが利用登録をする際にメールアドレス、ユーザー名、パスワードなどの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当方の提携先（情報提供元、広告主、広告配信先などを含みます。以下「提携先」といいます。）などから収集することがあります。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第3条（個人情報を収集・利用する目的）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方が個人情報を収集・利用する目的は、以下のとおりです。
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  当方サービスの提供・運営のため
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当方が提供する他のサービスの案内のメールを送付するため
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  メンテナンス、重要なお知らせなど必要に応じたご連絡のため
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  上記の利用目的に付随する目的
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第4条（利用目的の変更）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第5条（個人情報の第三者提供）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第6条（個人情報の開示）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第7条（個人情報の訂正および削除）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、当方に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第8条（個人情報の利用停止等）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第9条（プライバシーポリシーの変更）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第10条（お問い合わせ窓口）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          本ポリシーに関するお問い合わせは、本サービス内のお問い合わせフォームまでお願いいたします。
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 4 }}>
          制定日：2024年7月20日
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          最終改定日：2025年7月24日
        </Typography>
      </LegalPageTemplate>
    </>
  );
};

export default PrivacyClient;
