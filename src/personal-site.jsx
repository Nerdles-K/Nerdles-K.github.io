import { useEffect, useState } from "react";
import "./App.css";

const projects = [
  {
    number: "01",
    title: "Synesthesia",
    category: "生成式 AI · 音乐",
    summary:
      "在有限显存下，让语言模型学习 MIDI 音乐序列，并完成从数据到生成结果的完整实验闭环。",
    challenge: "如何把 MIDI 转成模型可学习的序列，同时控制微调所需的显存。",
    contribution: "负责数据清洗、序列构造、QLoRA 微调与训练稳定性调试。",
    outcome: "跑通端到端 fine-tuning pipeline，得到可以继续评测和迭代的音乐生成原型。",
    tags: ["QLoRA", "Fine-tuning", "MIDI", "Python"],
    mark: "♫",
    tone: "coral",
  },
  {
    number: "02",
    title: "HSD 多智能体平台",
    category: "SIAT · Agent 系统",
    summary:
      "在中科院深圳先进院参与搭建多智能体协作系统，让不同角色的 agent 共同处理复杂任务。",
    challenge: "如何让任务拆解、角色分工和结果整合形成稳定的协作流程。",
    contribution: "基于 Agno 设计多 agent 工作流，并参与系统能力的组合与验证。",
    outcome: "完成可运行的多智能体协作原型，积累了从单 agent 到系统设计的实践经验。",
    tags: ["Multi-Agent", "Agno", "LLM", "系统设计"],
    mark: "⌘",
    tone: "blue",
  },
  {
    number: "03",
    title: "COSCO AIS 轨迹异常检测",
    category: "航运安全 · 时序数据",
    summary:
      "从连续的船舶定位数据中寻找异常航行信号，把现实业务问题转化为可分析的时序任务。",
    challenge: "如何从噪声较多的 AIS 轨迹中识别偏航、异常停留等潜在风险。",
    contribution: "参与数据处理、轨迹特征构建、异常行为定义与模型实验。",
    outcome: "建立从原始 AIS 数据到异常事件识别的分析流程。",
    tags: ["异常检测", "时序数据", "AIS", "数据分析"],
    mark: "≈",
    tone: "green",
  },
];

const statuses = [
  "研究 LLM 数据质量",
  "补一部错过的电影",
  "打两局 CS2",
  "构思下一个 side project",
  "调一个还没收敛的参数",
];

const interests = [
  {
    number: "A",
    title: "数据质量",
    description: "什么样的数据真正帮助模型学习，而不只是让数据集看起来更大？",
  },
  {
    number: "B",
    title: "模型评测",
    description: "一个结果看起来不错时，我们究竟应该相信哪一部分？",
  },
  {
    number: "C",
    title: "Agent 系统",
    description: "模型如何从回答问题，走向使用工具、协作和完成任务？",
  },
];

const contactItems = [
  { label: "Email", value: "待补充真实邮箱", href: "" },
  { label: "GitHub", value: "待补充 GitHub 地址", href: "" },
];

function StatusLine() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % statuses.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="status-line" aria-label={`此刻正在${statuses[statusIndex]}`}>
      <span className="status-line__dot" aria-hidden="true" />
      <span className="status-line__label">此刻正在</span>
      <span className="status-line__value" key={statusIndex} aria-hidden="true">
        {statuses[statusIndex]}
      </span>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card project-card--${project.tone}`}>
      <div className="project-card__rail" aria-hidden="true">
        <span className="project-card__number">{project.number}</span>
        <span className="project-card__mark">{project.mark}</span>
      </div>

      <div className="project-card__body">
        <p className="project-card__category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>

        <dl className="project-card__details">
          <div>
            <dt>问题</dt>
            <dd>{project.challenge}</dd>
          </div>
          <div>
            <dt>我的工作</dt>
            <dd>{project.contribution}</dd>
          </div>
          <div>
            <dt>当前成果</dt>
            <dd>{project.outcome}</dd>
          </div>
        </dl>

        <ul className="tag-list" aria-label={`${project.title} 使用的技术`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function PersonalSite() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="返回页面顶部">
          <span>ZX</span>
          <small>FIELD NOTES</small>
        </a>

        <nav className="nav" aria-label="主导航">
          <a href="#about">关于</a>
          <a href="#work">项目</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" id="about" aria-labelledby="hero-title">
          <div className="hero__identity reveal reveal--1">
            <p className="eyebrow">AI · DATA SCIENCE · AGENT SYSTEMS</p>
            <div className="nameplate">
              <span className="nameplate__cn">许子阳</span>
              <span className="nameplate__en">Ziyang Xu</span>
            </div>
          </div>

          <div className="hero__statement reveal reveal--2">
            <h1 id="hero-title">
              把还没想明白的问题，
              <em>做成可以验证的东西。</em>
            </h1>
          </div>

          <div className="hero__intro reveal reveal--3">
            <p>
              我是香港中文大学（深圳）数据科学与大数据技术专业的大四学生，刚结束一段在巴黎的交换学习。
            </p>
            <p>
              目前关注 LLM 数据质量、模型评测和 Agent
              系统。我喜欢从一个不太确定的问题出发，把它拆开、做出来，再用结果校正理解。
            </p>
            <StatusLine />
          </div>

          <div className="hero__meta reveal reveal--4" aria-label="个人经历摘要">
            <div>
              <span>BASE</span>
              <strong>Shenzhen, CN</strong>
            </div>
            <div>
              <span>EDUCATION</span>
              <strong>CUHK-Shenzhen</strong>
            </div>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="section-index">01 / SELECTED WORK</p>
            <div>
              <h2 id="work-title">做过的一些事</h2>
              <p>不是完成任务的清单，而是我怎样理解问题的记录。</p>
            </div>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>

          <p className="work-note">
            这些项目未必都有漂亮的结果，但每一个都留下了可以复用的方法、踩过的坑，以及下一次会做得更好的理由。
          </p>
        </section>

        <section className="questions-section" aria-labelledby="questions-title">
          <div className="section-heading section-heading--compact">
            <p className="section-index">02 / OPEN QUESTIONS</p>
            <div>
              <h2 id="questions-title">还在追的问题</h2>
              <p>比“我会什么”更能描述我现在的，是这些还没有标准答案的问题。</p>
            </div>
          </div>

          <ol className="interest-list">
            {interests.map((interest) => (
              <li key={interest.number}>
                <span>{interest.number}</span>
                <div>
                  <h3>{interest.title}</h3>
                  <p>{interest.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="section-index">03 / SAY HELLO</p>
          <div className="contact-section__content">
            <div>
              <h2 id="contact-title">如果你也在琢磨类似的问题，欢迎来聊。</h2>
              <p>研究想法、side project、实习机会，或者只是一部值得看的电影，都可以。</p>
            </div>

            <ul className="contact-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a href={item.href}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <div className="contact-list__placeholder">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <span aria-hidden="true">—</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>许子阳 · Ziyang Xu</p>
        <p>在一个想改变现状的下午开始，持续更新中。</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </div>
  );
}
