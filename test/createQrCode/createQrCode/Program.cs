using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.IO;

namespace createQrCode
{
    class Program
    {
        static void Main(string[] args)
        {
            //createPNG("c:/temp", "c:/", 2480, 3508, 620, 700, 30, 80);
            //createPNG("/private/var/gedy/", "/private/var/gedy/merge/", 2480, 3508, 620, 700, 30, 80);
            createPNG("/private/var/gedy/", "/private/var/gedy/test/", 2480, 3508, 620, 700, 30, 80);
        }
        //a4纸   2480x3508
        //2480/4 620  3508/5 701        620     700 
        static void createPNG(string path,string outPath,int width,int height,int wid,int hei,int left,int top)
        {
            //string[] files = Directory.GetFiles(path);

            DirectoryInfo dir = new DirectoryInfo(path);
            FileInfo[] files1 = dir.GetFiles();
            // FileInfo[] files = new FileInfo[20];
            List<FileInfo> files = new List<FileInfo>();



            foreach (var file in files1)
                if (file.Name.Split('.')[1] == "jpg")
                    files.Add(file);
                    
                    
            //foreach(var file in files)
            //{
            //   string fileName= file.Name;
            //}
            Bitmap bitmap = new Bitmap(width, height);
            Graphics graphics = Graphics.FromImage(bitmap);
            graphics.FillRectangle(Brushes.White, new Rectangle(0, 0, width, height));

            string start, end=null;
            start = files[0].Name.Split('.')[0];

            Font drawFont = new Font("Arial", 24, FontStyle.Bold);//显示的字符串使用的字体
            SolidBrush drawBrush = new SolidBrush(Color.Black);//写字符串用的刷子
            PointF drawPoint;
            for (int i = 0; i < 5; i++)
                for (int j = 0; j < 4; j++)
                {
                    if ((4 * i + j) > files.Count - 1)
                        break;
                    Image image = Image.FromFile(files[4 * i + j].FullName);
                    graphics.DrawImage(image, j * wid + left, i * hei + top);
                    Console.WriteLine(string.Format("drawImage x [{0}] , y [{1}]", j * wid + left, i * hei + top));
                    string fn = files[4 * i + j].Name.Split('.')[0];
                    end = fn;
                    string str = System.Text.RegularExpressions.Regex.Replace(fn, @"(\w{4})", "$1-").Trim('-');
                    str = str + "     ";
                    //drawPoint = new PointF(j * wid + left, i * hei + top + 480);//显示的字符串左上角的坐标
                    //graphics.DrawString(str, drawFont, drawBrush, drawPoint);
                    drawPoint = new PointF((j + 0.35f) * wid + left, (i + 0.31f) * hei + top);//显示的字符串左上角的坐标
                    try
                    {
                        DrawCycString(graphics, str, drawFont, drawBrush, drawPoint, wid, hei);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);

                    }
                }
            string range = start + "--" + end;
             drawPoint = new PointF(width/2 - 400, 20);//显示的字符串左上角的坐标
            graphics.DrawString(range, drawFont, drawBrush, drawPoint);
             drawPoint = new PointF(width / 2 - 400, height-80);//显示的字符串左上角的坐标
            graphics.DrawString(range, drawFont, drawBrush, drawPoint);
            bitmap.Save(outPath+range+".bmp");

            
         //  Image.FromFile(path)
        }
        static void DrawCycString(Graphics g,string s,Font font,SolidBrush brush,PointF origin,int width,int height){
           // string s = "测试文字测试文字测试文字测试文字测试文字测试文字测试文字";
            //var origin = new Point(Width / 2, Height / 2);
            //int radius =  width/ 2;

            float radius =  width/2.7f;

            //Graphics g = e.Graphics;
            //var brush = new SolidBrush(ForeColor);
           // var font = new Font("Arial", 20);
            var format = new StringFormat()
            {
                Alignment = StringAlignment.Center,
                LineAlignment = StringAlignment.Center,
            };

            g.TranslateTransform(origin.X, origin.Y);
            Console.WriteLine(string.Format("TranslateTransform origin.X [{0}] , origin.Y [{1}]", origin.X, origin.Y));

            foreach (var c in s)
            {
                g.RotateTransform(360f / s.Length);
                g.DrawString(c.ToString(), font, brush, 0, -radius, format);
            }
            g.TranslateTransform(-origin.X, -origin.Y);
            //brush.Dispose();
            //font.Dispose();
        }

    }
}