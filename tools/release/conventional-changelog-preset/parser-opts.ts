export default {
  headerPattern: /^(?:(APM-\d+) )?(\w*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: [
    `issue`,
    `type`,
    `scope`,
    `subject`,
  ],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: [`header`, `hash`],
};
