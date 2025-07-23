'use client';

import { Typography, List, ListItem, ListItemText } from '@mui/material';
import Script from 'next/script';
import React from 'react';

import LegalPageTemplate from '@/components/common/templates/LegalPageTemplate';
import { useI18n } from '@/hooks/useI18n';
import { getLegalPageSchema } from '@/lib/metadata/pageSchemas';

const TermsPage: React.FC = () => {
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
        <Typography variant="body2" paragraph>
          本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第2条（利用登録）
        </Typography>
        <Typography variant="body2" paragraph>
          1. 本サービスでは、以下の方法による利用登録が可能です：
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）メールアドレス認証：メールアドレス、ユーザー名、パスワードによる登録と認証完了"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）Google OAuth認証：Googleアカウントを使用した認証（即座利用可能）"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
        <Typography variant="body2" paragraph>
          2.
          メールアドレスによる登録の場合、メール認証完了まですべての機能利用ができません。認証メールに記載されたリンクをクリックして認証を完了してください。
        </Typography>
        <Typography variant="body2" paragraph>
          3. 当方がこれを承認することによって、利用登録が完了するものとします。
        </Typography>
        <Typography variant="body2" paragraph>
          4.
          当方は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）利用登録の申請に際して虚偽の事項を届け出た場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）本規約に違反したことがある者からの申請である場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（3）その他、当方が利用登録を相当でないと判断した場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第3条（サービス料金）
        </Typography>
        <Typography variant="body2" paragraph>
          本サービスは完全無料で提供されます。ユーザーは、セットリスト作成、楽曲管理、画像生成、共有機能等、すべての機能を無料で利用できます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第4条（ユーザーIDおよびパスワードの管理）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第5条（禁止事項）
        </Typography>
        <Typography variant="body2" paragraph>
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）法令または公序良俗に違反する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）犯罪行為に関連する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（3）当方、本サービスの他のユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（4）当方のサービスの運営を妨害するおそれのある行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（5）他のユーザーに関する個人情報等を収集または蓄積する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（6）不正アクセスをし、またはこれを試みる行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（7）他のユーザーに成りすます行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（8）当方のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（9）自動化ツール、ボット、スクレイピング等による過度なアクセスやデータ収集"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（10）レート制限を回避する行為や、システムに過度な負荷をかける行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（11）複数アカウントを作成してサービスの制限を回避する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（12）その他、当方が不適切と判断する行為"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第6条（セキュリティ制限・利用制限）
        </Typography>
        <Typography variant="body2" paragraph>
          1. 当方は、サービスの安全性と品質を保つため、以下のセキュリティ制限を実施します：
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）レート制限：過度なアクセスに対する一時的な利用制限"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）ブルートフォース攻撃検知：複数回の認証失敗に対するアカウント・IP制限"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（3）異常アクセス検知：不正アクセスパターンの検出と自動遮断"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
        <Typography variant="body2" paragraph>
          2. これらの制限は自動的に実行され、正常な利用が確認された場合は自動的に解除されます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第7条（本サービスの提供の停止等）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）本サービスにかかるコンピュータシステムの保守点検または更新を行う場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（3）コンピュータまたは通信回線等が事故により停止した場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（4）セキュリティ上の脅威や攻撃が検出された場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（5）その他、当方が本サービスの提供が困難と判断した場合"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第8条（コンテンツの公開・共有）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          ユーザーは、作成したセットリストを「公開」設定にすることで、他のユーザーや一般の方々とセットリストを共有することができます。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          公開されたセットリストは、専用URLを通じて誰でもアクセス可能となり、QRコード付きの画像として生成・共有することができます。
        </Typography>
        <Typography variant="body2" paragraph>
          3. ユーザーは、いつでも公開設定を変更し、セットリストを非公開にすることができます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第9条（著作権）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          ユーザーは、本サービスを利用して作成したセットリストや楽曲情報等のコンテンツについて、自らが投稿その他送信することについての適法な権利を有していること、および投稿データが第三者の権利を侵害していないことについて、当方に対し表明し、保証するものとします。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          ユーザーは、本サービスを利用して作成したコンテンツについて、当方に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用、複製、配布、派生著作物の作成、表示および実行に関するライセンスを付与します。ただし、このライセンスはサービス提供に必要な範囲に限定されます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第10条（アカウント削除・データ削除）
        </Typography>
        <Typography variant="body2" paragraph>
          1. ユーザーは、いつでもアカウントを削除することができます。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          アカウント削除を実行すると、関連するすべてのデータ（楽曲データ、セットリストデータ、メール履歴、セキュリティログ等を含む）が完全に削除され、復元することはできません。
        </Typography>
        <Typography variant="body2" paragraph>
          3.
          削除されたアカウントのメールアドレスは、削除後にあらためて利用登録に使用することができます。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第11条（免責事項）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          当方は、本サービスに起因してユーザーに生じたあらゆる損害について、当方の故意又は重過失による場合を除き、一切の責任を負いません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第12条（サービス内容の変更等）
        </Typography>
        <Typography variant="body2" paragraph>
          当方は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第13条（利用規約の変更）
        </Typography>
        <Typography variant="body2" paragraph>
          1.
          当方は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="（1）本規約の変更がユーザーの一般の利益に適合するとき。"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="（2）本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第14条（個人情報の取扱い）
        </Typography>
        <Typography variant="body2" paragraph>
          当方は、本サービスの利用によって取得する個人情報については、当方「プライバシーポリシー」に従い適切に取り扱うものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第15条（通知または連絡）
        </Typography>
        <Typography variant="body2" paragraph>
          ユーザーと当方との間の通知または連絡は、当方の定める方法によって行うものとします。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第16条（権利義務の譲渡の禁止）
        </Typography>
        <Typography variant="body2" paragraph>
          ユーザーは、当方の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          第17条（準拠法・裁判管轄）
        </Typography>
        <Typography variant="body2" paragraph>
          1. 本規約の解釈にあたっては、日本法を準拠法とします。
        </Typography>
        <Typography variant="body2" paragraph>
          2.
          本サービスに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。
        </Typography>
      </LegalPageTemplate>
    </>
  );
};

export default TermsPage;
