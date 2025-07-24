'use client';

import { Typography, List, ListItem, ListItemText } from '@mui/material';
import Script from 'next/script';
import React from 'react';

import LegalPageTemplate from '@/components/common/templates/LegalPageTemplate';
import { useI18n } from '@/hooks/useI18n';
import { getLegalPageSchema } from '@/lib/metadata/pageSchemas';

const TermsClient: React.FC = () => {
  const { messages } = useI18n();
  const termsSchema = getLegalPageSchema('terms');

  return (
    <>
      <Script
        id="terms-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      <LegalPageTemplate title={messages.pages.terms.title}>
        <Typography variant="body2" color="text.secondary" paragraph>
          この利用規約（以下、「本規約」といいます。）は、mosquitone（以下、「当方」といいます。）がこのウェブサイト上で提供するサービス「Setlist
          Studio」（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第1条（適用）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第2条（利用登録）
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  登録希望者が当方の定める方法によって利用登録を申請し、当方がこれを承認することによって、利用登録が完了するものとします。
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  当方は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります。
                </Typography>
              }
            />
          </ListItem>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    利用登録の申請に際して虚偽の事項を届け出た場合
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    本規約に違反したことがある者からの申請である場合
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    その他，当方が利用登録を相当でないと判断した場合
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第3条（ユーザーIDおよびパスワードの管理）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第4条（利用料金および支払方法）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          本サービスの利用は現在無料です。将来的に有料プランを導入する場合は、事前に通知いたします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第5条（禁止事項）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  法令または公序良俗に違反する行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  犯罪行為に関連する行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  当方、本サービスの他の利用者、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  本サービスによって得られた情報を商業的に利用する行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  当方のサービスの運営を妨害するおそれのある行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  他のユーザーに関する個人情報等を収集または蓄積する行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  不正アクセスをし、またはこれを試みる行為
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: 'list-item', pl: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  他のユーザーに成りすます行為
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第6条（本サービスの提供の停止等）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第7条（著作権）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーが本サービスを利用して作成したセットリストに関する著作権その他一切の権利は、ユーザーに帰属します。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第8条（保証の否認および免責事項）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第9条（サービス内容の変更等）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第10条（利用規約の変更）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第11条（個人情報の取扱い）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          当方は、本サービスの利用によって取得する個人情報については、当方「プライバシーポリシー」に従い適切に取り扱うものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第12条（通知または連絡）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーと当方との間の通知または連絡は、当方の定める方法によって行うものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第13条（権利義務の譲渡の禁止）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          ユーザーは、当方の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第14条（準拠法・裁判管轄）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当方の本店所在地を管轄する裁判所を専属的合意管轄とします。
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

export default TermsClient;
