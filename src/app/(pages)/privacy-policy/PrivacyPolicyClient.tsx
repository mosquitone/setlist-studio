'use client';

import { Typography, List, ListItem, ListItemText, Stack } from '@mui/material';
import Script from 'next/script';
import React from 'react';

import LegalPageTemplate from '@/components/common/templates/LegalPageTemplate';
import { useI18n } from '@/hooks/useI18n';
import { getLegalPageSchema } from '@/lib/metadata/pageSchemas';

const PrivacyPolicyClient: React.FC = () => {
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
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">
            mosquitone（以下「当方」といいます。）は、本ウェブサイト上で提供するサービス「Setlist
            Studio」（以下「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </Typography>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第1条（個人情報）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、メールアドレス、その他の記述等により特定の個人を識別できる情報を指します。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              本サービスでは、具体的に以下の情報を収集します：
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      メールアドレス
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      ユーザー名（表示名）
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      パスワード（暗号化して保存）
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Google
                      OAuth認証を利用する場合：Googleアカウントのメールアドレス、プロフィール名
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      IPアドレス（セキュリティ目的でハッシュ化して保存）
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      アクセスログ（ページ閲覧履歴、操作ログ）
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第2条（個人情報の収集方法）
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                当方は、ユーザーが利用登録をする際にメールアドレス、ユーザー名、パスワードなどの個人情報をお尋ねします。Google
                OAuth認証を利用する場合は、Googleから提供される認証情報（メールアドレス、プロフィール名）を収集します。
              </Typography>
              <Typography variant="body2" color="text.secondary">
                また、本サービスの利用に際して、Cookieを使用して認証トークンを保存し、アクセスログ、IPアドレス等の情報を自動的に収集します。これらの情報は、サービスの提供、セキュリティの確保、不正利用の防止等の目的で使用されます。
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第3条（個人情報を収集・利用する目的）
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第4条（利用目的の変更）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第5条（個人情報の第三者提供）
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      業務委託：当方が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      事業の承継：合併その他の事由により事業の承継が行われる場合であって、承継前の利用目的の範囲内で取り扱われる場合
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第6条（個人情報の開示）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      当方の業務の適正な実施に著しい支障を及ぼすおそれがある場合
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      法令に違反することとなる場合
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Typography variant="body2" color="text.secondary">
              なお、個人情報の開示請求については、手数料はいただきません。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第7条（個人情報の訂正および削除）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、当方に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第8条（個人情報の利用停止等）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当方は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第9条（セキュリティ対策）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当方は、収集した個人情報の漏えい、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      SSL/TLS暗号化通信による送受信データの保護
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      パスワードのハッシュ化（bcrypt）による安全な保存
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      HttpOnly Cookieを使用した認証トークンの保護
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      定期的なセキュリティ監査と脆弱性チェック
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      不正アクセス検知システム（レート制限、ブルートフォース攻撃対策）
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第10条（個人情報の保存期間と削除）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当方は、個人情報を以下の期間保存し、期間経過後は速やかに削除します。
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      アカウント情報：ユーザーがアカウントを削除するまで
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      アクセスログ・セキュリティログ：90日間
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      使用済み認証トークン：90日間
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Typography variant="body2" color="text.secondary">
              アカウント削除時は、ユーザーに関連する全ての個人情報（楽曲、セットリスト等）を速やかに削除します。ただし、法令により保存が義務付けられている場合はこの限りではありません。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第11条（国際的なデータ移転）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              本サービスは、サービス提供のために海外のサーバー（Vercel：米国等）を利用しており、ユーザーの個人情報が日本国外に移転される場合があります。この場合も、当方は本ポリシーに従って個人情報を適切に管理します。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第12条（子どもの個人情報）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              本サービスは13歳以上の方を対象としています。13歳未満の子どもから個人情報を収集することはありません。13歳未満の子どもが個人情報を提供したことが判明した場合、速やかに当該情報を削除します。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第13条（プライバシーポリシーの変更）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6" component="h2">
              第14条（お問い合わせ窓口）
            </Typography>
            <Typography variant="body2" color="text.secondary">
              本ポリシーに関するお問い合わせは、以下の方法でお願いいたします。
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      メール：mosquitone8+setliststudiosupport@gmail.com
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      X（旧Twitter）：
                      <a
                        href="https://x.com/mosquitone_info"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        @mosquitone_info
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      GitHubリポジトリのIssue：
                      <a
                        href="https://github.com/mosquitone/setlist-studio/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        https://github.com/mosquitone/setlist-studio/issues
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Stack>

          <Stack spacing={0}>
            <Typography variant="body2" color="text.secondary">
              制定日：2024年7月20日
            </Typography>
            <Typography variant="body2" color="text.secondary">
              最終改定日：2025年7月29日
            </Typography>
          </Stack>
        </Stack>
      </LegalPageTemplate>
    </>
  );
};

export default PrivacyPolicyClient;
