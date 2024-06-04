import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import ForumIcon from '@mui/icons-material/Forum';
import InfoIcon from '@mui/icons-material/Info';
import PaidIcon from '@mui/icons-material/Paid';
import { useConfirm } from 'material-ui-confirm';

import textToDialogContent from '@components/dialogs/DialogContent';
// @ts-ignore
import changelogTxt from '../../../../changelog.txt';

interface Props {
  onClose: () => void;
  openState: boolean;
  id: string;
}

const HelpContent = `
支持各种b站链接，部分油管链接

关注诺莺nox谢谢喵
`;

export default function HelpDialog({ onClose, openState, id }: Props) {
  const confirm = useConfirm();
  const openChangelogWindow = (val: string) => {
    confirm({
      title: '版本更新',
      content: textToDialogContent(val.split('\n')),
      confirmationText: '好的',
      hideCancelButton: true,
      dialogProps: { sx: { maxHeight: '60vh', top: '20%' } },
    })
      .then()
      .catch();
  };

  return (
    <div>
      <Dialog open={openState} id={id} onClose={onClose}>
        <DialogTitle>帮助</DialogTitle>
        <DialogContent sx={{ maxWidth: '50vw' }}>
          {HelpContent.split('\n').map((str, index) => (
            <DialogContentText key={`helptext-${index}`}>
              {str}
            </DialogContentText>
          ))}
          <p />
          <Button
            startIcon={<EmailIcon />}
            onClick={() =>
              window.open(
                'https://message.bilibili.com/?spm_id_from=333.999.0.0#whisper/mid1989881',
              )
            }
          >
            有问题？B站私信
          </Button>
          <div />
          <Button
            startIcon={<GitHubIcon />}
            onClick={() =>
              window.open('https://github.com/lovegaoshi/azusa-player/wiki')
            }
          >
            电闹播放器@Github
          </Button>
          <div />
          <Button
            startIcon={<GitHubIcon />}
            onClick={() =>
              window.open(
                'https://github.com/lovegaoshi/azusa-player-mobile/releases/latest',
              )
            }
          >
            电闹播放器手机版震撼发布
          </Button>
          <div />
          <Button
            startIcon={<ForumIcon />}
            onClick={() =>
              window.open('https://bbs.nga.cn/read.php?tid=37678803')
            }
          >
            来P综6@nga听歌吹水
          </Button>
          <div />
          <Button
            startIcon={<PaidIcon />}
            onClick={() =>
              window.open(
                'https://raw.githubusercontent.com/lovegaoshi/azusa-player-mobile/5795492b49048046b36583502f74caa9fdb2badb/docs/docs/usage-tutorial/images/sponsor.jpg',
              )
            }
          >
            我很可爱请给我钱
          </Button>
          <div />
          <Button
            startIcon={<InfoIcon />}
            onClick={() =>
              fetch(changelogTxt)
                .then((val) => val.text())
                .then(openChangelogWindow)
            }
          >
            更新说明
          </Button>
          <div />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>好的</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
